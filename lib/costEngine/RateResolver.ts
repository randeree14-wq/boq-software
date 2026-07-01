import { MeasurementItem } from "@/types/boq";
import { RateRules } from "@/lib/domain";

export class RateResolver {
  /**
   * Resolve rate for a measurement item.
   * Priority:
   * 1. Item-specific override (projectRates)
   * 2. Element default rate
   * 3. Fallback based on unit
   */
  resolveRate(
    item: Pick<MeasurementItem, "costPlanId" | "elementId" | "module" | "unit">,
    elementRates: Record<string, number>,
    projectRates: Record<string, number>
  ): number {
    // 1. Item-specific override
    const itemKey = `${item.costPlanId}|${item.elementId}|${item.module}`;
    if (projectRates[itemKey] !== undefined) {
      const rate = projectRates[itemKey];
      if (RateRules.validateRate(rate)) return rate;
    }

    // 2. Element default rate
    if (elementRates[item.elementId] !== undefined) {
      const rate = elementRates[item.elementId];
      if (RateRules.validateRate(rate)) return rate;
    }

    // 3. Fallback
    return RateRules.getFallbackRate(item.unit);
  }

  /**
   * Bulk resolve rates for multiple items.
   */
  resolveRates(
    items: Pick<MeasurementItem, "costPlanId" | "elementId" | "module" | "unit">[],
    elementRates: Record<string, number>,
    projectRates: Record<string, number>
  ): number[] {
    return items.map(item => this.resolveRate(item, elementRates, projectRates));
  }
}