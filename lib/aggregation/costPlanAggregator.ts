import { CostPlan, ComputedMeasurementItem, Element } from "@/types/boq";

export type ElementalSummaryItem = {
  elementId: string;
  elementName: string;
  total: number;
  ratePerM2: number;
  percentageOfTotal: number;
};

export type ElementalSummary = {
  costPlanId: string;
  costPlanName: string;
  grossFloorArea: number;
  totalValue: number;
  elements: ElementalSummaryItem[];
};

export function getElementalSummaryForCostPlan(
  costPlanId: string,
  costPlans: CostPlan[],
  computedItems: ComputedMeasurementItem[],
  elements: Element[]
): ElementalSummary | null {
  const costPlan = costPlans.find(cp => cp.id === costPlanId);
  if (!costPlan) return null;

  const items = computedItems.filter(item => item.costPlanId === costPlanId);

  const elementTotals: Record<string, number> = {};
  items.forEach(item => {
    elementTotals[item.elementId] = (elementTotals[item.elementId] || 0) + item.amount;
  });

  const totalValue = Object.values(elementTotals).reduce((sum, val) => sum + val, 0);

  const summaryItems: ElementalSummaryItem[] = Object.entries(elementTotals).map(([elementId, total]) => {
    const element = elements.find(e => e.id === elementId);
    return {
      elementId,
      elementName: element?.name || elementId,
      total,
      ratePerM2: costPlan.grossFloorArea > 0 ? total / costPlan.grossFloorArea : 0,
      percentageOfTotal: totalValue > 0 ? (total / totalValue) * 100 : 0,
    };
  });

  summaryItems.sort((a, b) => {
    const aOrder = elements.find(e => e.id === a.elementId)?.order ?? 999;
    const bOrder = elements.find(e => e.id === b.elementId)?.order ?? 999;
    return aOrder - bOrder;
  });

  return {
    costPlanId: costPlan.id,
    costPlanName: costPlan.name,
    grossFloorArea: costPlan.grossFloorArea,
    totalValue,
    elements: summaryItems,
  };
}