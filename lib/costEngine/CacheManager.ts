import { ComputedMeasurementItem } from "@/types/boq";

/**
 * ⚠️ CACHE IS DISPOSABLE – memory only, reset on refresh.
 * NEVER persist cache data.
 */
export class CacheManager {
  private costPlanCache = new Map<string, ComputedMeasurementItem[]>();
  private projectCache = new Map<string, number>(); // projectId → total

  // Cost Plan cache
  getCostPlanItems(costPlanId: string): ComputedMeasurementItem[] | null {
    return this.costPlanCache.get(costPlanId) || null;
  }

  setCostPlanItems(costPlanId: string, items: ComputedMeasurementItem[]): void {
    this.costPlanCache.set(costPlanId, items);
  }

  invalidateCostPlan(costPlanId: string): void {
    this.costPlanCache.delete(costPlanId);
  }

  // Project cache
  getProjectTotal(projectId: string): number | null {
    return this.projectCache.get(projectId) || null;
  }

  setProjectTotal(projectId: string, total: number): void {
    this.projectCache.set(projectId, total);
  }

  invalidateProject(projectId: string): void {
    this.projectCache.delete(projectId);
  }

  // Global clear
  clear(): void {
    this.costPlanCache.clear();
    this.projectCache.clear();
  }
}