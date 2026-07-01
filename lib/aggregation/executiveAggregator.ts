import { CostPlan, ComputedMeasurementItem, SpecialistServiceItem } from "@/types/boq";
import { CostPlanRules } from "@/lib/domain";

export type ExecutiveCostPlanLine = {
  name: string;
  amount: number;
  weight: number;
  contribution: number;
};

export type ExecutiveSummary = {
  includedCostPlans: ExecutiveCostPlanLine[];
  totalBuildingWorks: number;
  specialistServices: number;
  preliminaries: number;
  contingency: number;
  escalation: number;
  professionalFees: number;
  finalTotal: number;
};

export function getExecutiveSummary(
  costPlans: CostPlan[],
  computedItems: ComputedMeasurementItem[] | undefined,
  specialistServices: SpecialistServiceItem[],
  preliminaries: number,
  contingency: number,
  escalationAmount: number,
  professionalFees: number
): ExecutiveSummary {
  const safeItems = computedItems || [];

  const included = costPlans.filter(cp =>
    CostPlanRules.isIncluded(cp.includedInExecutiveSummary, cp.executiveWeight)
  );

  const lines: ExecutiveCostPlanLine[] = included.map(cp => {
    const items = safeItems.filter(i => i.costPlanId === cp.id);
    const total = items.reduce((sum, i) => sum + i.amount, 0);
    const weight = cp.executiveWeight ?? 1;
    const contribution = CostPlanRules.calculateContribution(total, weight);
    return {
      name: cp.name,
      amount: total,
      weight,
      contribution,
    };
  });

  const totalBuildingWorks = lines.reduce((sum, line) => sum + line.contribution, 0);
  const specialistTotal = specialistServices.reduce((sum, s) => sum + s.value, 0);

  const finalTotal = totalBuildingWorks
    + specialistTotal
    + preliminaries
    + contingency
    + escalationAmount
    + professionalFees;

  return {
    includedCostPlans: lines,
    totalBuildingWorks,
    specialistServices: specialistTotal,
    preliminaries,
    contingency,
    escalation: escalationAmount,
    professionalFees,
    finalTotal,
  };
}