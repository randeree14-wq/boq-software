import { CostPlan, ComputedMeasurementItem, Element } from "@/types/boq";
import { ElementalSummaryItem } from "./costPlanAggregator";

export type ProjectElementalSummary = {
  totalValue: number;
  totalGFA: number;
  elements: ElementalSummaryItem[];
};

export function getProjectElementalSummary(
  costPlans: CostPlan[],
  computedItems: ComputedMeasurementItem[] | undefined,
  elements: Element[]
): ProjectElementalSummary {
  // Guard against undefined
  const safeItems = computedItems || [];
  
  const elementTotals: Record<string, number> = {};
  safeItems.forEach(item => {
    elementTotals[item.elementId] = (elementTotals[item.elementId] || 0) + item.amount;
  });

  const totalValue = Object.values(elementTotals).reduce((sum, val) => sum + val, 0);
  const totalGFA = costPlans.reduce((sum, cp) => sum + cp.grossFloorArea, 0);

  const summaryItems: ElementalSummaryItem[] = Object.entries(elementTotals).map(([elementId, total]) => {
    const element = elements.find(e => e.id === elementId);
    return {
      elementId,
      elementName: element?.name || elementId,
      total,
      ratePerM2: totalGFA > 0 ? total / totalGFA : 0,
      percentageOfTotal: totalValue > 0 ? (total / totalValue) * 100 : 0,
    };
  });

  summaryItems.sort((a, b) => {
    const aOrder = elements.find(e => e.id === a.elementId)?.order ?? 999;
    const bOrder = elements.find(e => e.id === b.elementId)?.order ?? 999;
    return aOrder - bOrder;
  });

  return {
    totalValue,
    totalGFA,
    elements: summaryItems,
  };
}