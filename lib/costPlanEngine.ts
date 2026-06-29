import { CostPlan } from "@/types/boq";

export function getCostPlanTotal(costPlan: CostPlan): number {
  return costPlan.items.reduce((sum, item) => sum + item.amount, 0);
}

export function getCostPlanBreakdown(costPlan: CostPlan): Record<string, number> {
  const breakdown: Record<string, number> = {};
  costPlan.items.forEach((item) => {
    const key = item.elementCode;
    breakdown[key] = (breakdown[key] || 0) + item.amount;
  });
  return breakdown;
}