import { ElementalSummary, ElementalSummaryItem, CostPlan } from "@/types/boq";
import { getCostPlanTotal, getCostPlanBreakdown } from "./costPlanEngine";

// Element mapping (hardcoded for now)
export const ELEMENT_CODES: Record<string, string> = {
  // Substructure
  "pad-footings": "SUB-01",
  "ground-beams": "SUB-02",
  "trench-excavation": "SUB-03",
  "blinding": "SUB-04",
  "substructure": "SUB-05",

  // Superstructure / Structural Frame
  "beams": "SS-01",
  "columns": "SS-02",
  "slabs": "SS-03",
  "structural-frame": "SS-04",

  // Internal Divisions
  "walls": "INT-01",
  "openings": "INT-02",
  "internal-divisions": "INT-03",

  // External Envelope
  "external-walls": "EXT-01",
  "windows": "EXT-02",
  "doors": "EXT-03",
  "external-facade": "EXT-04",

  // Finishes
  "plastering": "FIN-01",
  "tiling": "FIN-02",
  "paintwork": "FIN-03",
  "screeds": "FIN-04",
  "floor-finishes": "FIN-05",

  // Services
  "services": "SVC-01",
  "mechanical": "SVC-02",
  "electrical": "SVC-03",
  "plumbing": "SVC-04",

  // External Works
  "external-works": "EXT-W-01",

  // Preliminaries
  "preliminaries": "PRE-01",
};

export const ELEMENT_NAMES: Record<string, string> = {
  "SUB-01": "Pad Footings",
  "SUB-02": "Ground Beams",
  "SUB-03": "Trench Excavation",
  "SUB-04": "Blinding",
  "SUB-05": "Substructure",
  "SS-01": "Beams",
  "SS-02": "Columns",
  "SS-03": "Slabs",
  "SS-04": "Structural Frame",
  "INT-01": "Walls",
  "INT-02": "Openings",
  "INT-03": "Internal Divisions",
  "EXT-01": "External Walls",
  "EXT-02": "Windows",
  "EXT-03": "Doors",
  "EXT-04": "External Envelope",
  "FIN-01": "Plastering",
  "FIN-02": "Tiling",
  "FIN-03": "Paintwork",
  "FIN-04": "Screeds",
  "FIN-05": "Floor Finishes",
  "SVC-01": "Services",
  "SVC-02": "Mechanical",
  "SVC-03": "Electrical",
  "SVC-04": "Plumbing",
  "EXT-W-01": "External Works",
  "PRE-01": "Preliminaries",
};

/**
 * Generate Elemental Summary for a single Cost Plan
 * IMPORTANT: Each Cost Plan has its OWN Elemental Summary
 */
export function generateElementalSummary(costPlan: CostPlan): ElementalSummary {
  const breakdown = getCostPlanBreakdown(costPlan);
  const totalValue = getCostPlanTotal(costPlan);

  const elements: ElementalSummaryItem[] = Object.entries(breakdown).map(([code, value]) => ({
    name: ELEMENT_NAMES[code] || code,
    code: ELEMENT_CODES[code] || code,
    value,
    percentageOfCostPlan: totalValue > 0 ? (value / totalValue) * 100 : 0,
  }));

  // Sort by value descending
  elements.sort((a, b) => b.value - a.value);

  return {
    costPlanId: costPlan.id,
    elements,
    totalValue,
  };
}