import { MeasurementItem, CostPlan, ComputedMeasurementItem, Element } from "@/types/boq";
import { RateResolver } from "./RateResolver";
import { PricingEngine } from "./PricingEngine";
import { CacheManager } from "./CacheManager";
import { CostPlanRules } from "@/lib/domain";

// Simple event bus for triggering aggregation
type RecalcCallback = (costPlanId: string, computedItems: ComputedMeasurementItem[], total: number) => void;

export class RecalcEngine {
  private rateResolver: RateResolver;
  private pricingEngine: PricingEngine;
  private cacheManager: CacheManager;
  private versionMap = new Map<string, number>(); // costPlanId → version
  private processing = new Set<string>(); // Prevent concurrent updates
  private onUpdate: RecalcCallback | null = null;

  constructor(onUpdate?: RecalcCallback) {
    this.rateResolver = new RateResolver();
    this.pricingEngine = new PricingEngine();
    this.cacheManager = new CacheManager();
    this.onUpdate = onUpdate || null;
  }

  /**
   * Recalculate a single Cost Plan.
   * Steps:
   * 1. Load raw items for this Cost Plan
   * 2. Resolve rates (pure)
   * 3. Process quantities (pure)
   * 4. Calculate amounts (pure)
   * 5. Generate computed items
   * 6. Persist snapshot (via callback)
   * 7. Trigger aggregation (via callback)
   */
  async recalculateCostPlan(
    costPlanId: string,
    rawItems: MeasurementItem[],
    elementRates: Record<string, number>,
    projectRates: Record<string, number>
  ): Promise<{
    computedItems: ComputedMeasurementItem[];
    total: number;
    version: number;
  }> {
    // Version locking
    const currentVersion = (this.versionMap.get(costPlanId) || 0) + 1;
    this.versionMap.set(costPlanId, currentVersion);

    // Concurrency lock
    if (this.processing.has(costPlanId)) {
      await this.waitForProcessing(costPlanId);
    }
    this.processing.add(costPlanId);

    try {
      // 1. Filter raw items for this Cost Plan
      const items = rawItems.filter(item => item.costPlanId === costPlanId);

      // 2-5. Resolve rates, quantities (no quantity processing yet), calculate amounts
      const resolvedRates = this.rateResolver.resolveRates(items, elementRates, projectRates);
      const computed: ComputedMeasurementItem[] = items.map((item, index) => {
        const rate = resolvedRates[index];
        const amount = this.pricingEngine.calculateAmount(item.quantity, rate);
        return {
          ...item,
          rate,
          amount,
          versionId: `v${currentVersion}-${Date.now()}`,
          computedAt: Date.now(),
        };
      });

      const total = computed.reduce((sum, item) => sum + item.amount, 0);

      // 6. Persist snapshot (via callback)
      // 7. Trigger aggregation
      if (this.onUpdate) {
        this.onUpdate(costPlanId, computed, total);
      }

      // Update cache
      this.cacheManager.setCostPlanItems(costPlanId, computed);

      // Version check
      if (this.versionMap.get(costPlanId) !== currentVersion) {
        throw new Error(`Version mismatch for cost plan ${costPlanId} — recalculation superseded`);
      }

      return { computedItems: computed, total, version: currentVersion };
    } finally {
      this.processing.delete(costPlanId);
    }
  }

  /**
   * Recalculate all Cost Plans in a project.
   */
  async recalculateProject(
    projectId: string,
    costPlans: CostPlan[],
    allItems: MeasurementItem[],
    elementRates: Record<string, number>,
    projectRates: Record<string, number>
  ): Promise<void> {
    for (const cp of costPlans) {
      await this.recalculateCostPlan(cp.id, allItems, elementRates, projectRates);
    }
    // Invalidate project cache
    this.cacheManager.invalidateProject(projectId);
  }

  /**
   * Recalculate only the Cost Plans that contain given element IDs.
   */
  async recalculateAffectedElements(
    projectId: string,
    costPlans: CostPlan[],
    allItems: MeasurementItem[],
    elementIds: string[],
    elementRates: Record<string, number>,
    projectRates: Record<string, number>
  ): Promise<void> {
    // Find which Cost Plans have items with these elements
    const affectedCostPlanIds = new Set<string>();
    allItems.forEach(item => {
      if (elementIds.includes(item.elementId)) {
        affectedCostPlanIds.add(item.costPlanId);
      }
    });

    for (const cp of costPlans) {
      if (affectedCostPlanIds.has(cp.id)) {
        await this.recalculateCostPlan(cp.id, allItems, elementRates, projectRates);
      }
    }
    this.cacheManager.invalidateProject(projectId);
  }

  private async waitForProcessing(costPlanId: string): Promise<void> {
    while (this.processing.has(costPlanId)) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Expose cache manager for read-only access
  getCacheManager(): CacheManager {
    return this.cacheManager;
  }

  // Allow setting a new update callback
  setOnUpdate(callback: RecalcCallback): void {
    this.onUpdate = callback;
  }
}