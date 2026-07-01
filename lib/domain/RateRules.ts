export const RateRules = {
  validateRate: (rate: number): boolean => rate >= 0,

  getFallbackRate: (unit: string): number => {
    const fallbacks: Record<string, number> = {
      "m³": 1500,
      "m²": 800,
      "t": 12000,
      "m": 400,
      "No": 5000,
      "kg": 50,
      "hr": 200,
    };
    return fallbacks[unit] || 0;
  },

  /**
   * Resolve rate with priority:
   * 1. Item-specific override (projectRates)
   * 2. Element default rate
   * 3. Fallback based on unit
   */
  resolveRateWithPriority: (
    item: { costPlanId: string; elementId: string; module: string; unit: string },
    elementRates: Record<string, number>,
    projectRates: Record<string, number>
  ): number => {
    const itemKey = `${item.costPlanId}|${item.elementId}|${item.module}`;
    if (projectRates[itemKey] !== undefined) {
      return projectRates[itemKey];
    }
    if (elementRates[item.elementId] !== undefined) {
      return elementRates[item.elementId];
    }
    return RateRules.getFallbackRate(item.unit);
  },
};