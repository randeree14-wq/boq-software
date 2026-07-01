import { CostPlan } from "@/types/boq";

export const CostPlanRules = {
  validateName: (name: string): boolean => name.trim().length > 0,

  validateGFA: (gfa: number): boolean => gfa >= 0,

  isIncluded: (included: boolean, weight?: number): boolean => {
    if (weight !== undefined) return weight > 0;
    return included;
  },

  calculateContribution: (total: number, weight?: number): number => {
    if (weight !== undefined) return total * weight;
    return total;
  },

  getDefaultCostPlan: (name?: string): Omit<CostPlan, "id"> => ({
    name: name || "Unnamed Cost Plan",
    grossFloorArea: 0,
    includedInExecutiveSummary: true,
    executiveWeight: 1,
    version: 1,
    revisionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
};