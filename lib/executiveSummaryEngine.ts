import {
  ExecutiveSummary,
  ProjectCostLine,
  SpecialistServiceItem,
  EscalationData,
  CostPlan,
  ElementalSummary,
} from "@/types/boq";
import { getCostPlanTotal } from "./costPlanEngine";

export type ExecutiveSummaryInput = {
  projectName: string;
  totalGFA: number;
  baseDate: string;
  costPlans: CostPlan[];
  elementalSummaries: ElementalSummary[];
  specialistServices: SpecialistServiceItem[];  // Already correct
  preliminaries: number;
  contingency: number;
  escalations: EscalationData;
  professionalFees: {
    coreConsultants: number;
    specialistConsultants: number;
    disbursements: number;
  };
};

/**
 * Generate Executive Summary from all Cost Plans and inputs
 */
export function generateExecutiveSummary(
  input: ExecutiveSummaryInput
): ExecutiveSummary {
  // 1. Cost Plan Roll-up
  const costPlanLines: ProjectCostLine[] = input.costPlans.map((cp) => {
    const total = getCostPlanTotal(cp);
    return {
      name: cp.name,
      value: total,
      projectRatePerM2: input.totalGFA > 0 ? total / input.totalGFA : 0,
      percentageOfTotalProject: 0, // Calculated later
    };
  });

  const costPlanTotal = costPlanLines.reduce((sum, line) => sum + line.value, 0);

  // 2. Specialist Services
  const specialistTotal = input.specialistServices.reduce((sum, item) => sum + item.value, 0);

  const specialistServicesWithRates = input.specialistServices.map((item) => ({
    ...item,
    ratePerM2: input.totalGFA > 0 ? item.value / input.totalGFA : 0,
    percentageOfProject: 0, // Calculated later
  }));

  // 3. Construction Cost
  const estimatedCurrentConstructionCost = costPlanTotal + specialistTotal + input.preliminaries + input.contingency;

  // 4. Escalations
  const preConstructionEscalation = estimatedCurrentConstructionCost * (input.escalations.preConstructionRate / 100) * (input.escalations.preConstructionMonths / 12);
  const constructionEscalation = estimatedCurrentConstructionCost * (input.escalations.constructionRate / 100) * (input.escalations.constructionMonths / 12);
  const escalationAmount = preConstructionEscalation + constructionEscalation;

  const estimatedConstructionCostAtCompletion = estimatedCurrentConstructionCost + escalationAmount;

  // 5. Professional Fees
  const professionalFeesTotal = input.professionalFees.coreConsultants +
    input.professionalFees.specialistConsultants +
    input.professionalFees.disbursements;

  // 6. Final Development Cost
  const estimatedDevelopmentCostAtCompletion = estimatedConstructionCostAtCompletion + professionalFeesTotal;

  // Calculate percentages for all items based on final total
  const totalProjectCost = estimatedDevelopmentCostAtCompletion;

  // Update cost plan lines with percentages
  const updatedCostPlanLines = costPlanLines.map((line) => ({
    ...line,
    percentageOfTotalProject: totalProjectCost > 0 ? (line.value / totalProjectCost) * 100 : 0,
  }));

  // Update specialist services with percentages
  const updatedSpecialistServices = specialistServicesWithRates.map((item) => ({
    ...item,
    percentageOfProject: totalProjectCost > 0 ? (item.value / totalProjectCost) * 100 : 0,
  }));

  return {
    projectName: input.projectName,
    totalGFA: input.totalGFA,
    baseDate: input.baseDate,

    costPlanLines: updatedCostPlanLines,
    costPlanTotal,

    specialistServices: {
      items: updatedSpecialistServices,
      totalValue: specialistTotal,
    },

    preliminaries: input.preliminaries,
    contingency: input.contingency,

    estimatedCurrentConstructionCost,

    escalations: input.escalations,
    escalationAmount,
    estimatedConstructionCostAtCompletion,

    professionalFees: {
      coreConsultants: input.professionalFees.coreConsultants,
      specialistConsultants: input.professionalFees.specialistConsultants,
      disbursements: input.professionalFees.disbursements,
      total: professionalFeesTotal,
    },

    estimatedDevelopmentCostAtCompletion,
  };
}