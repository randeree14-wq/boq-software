import type { WallLocation } from "@/types/boq";

export interface CostPlanMapping {
  structure: {
    sectionId: string;
    elementId: string;
    description: string;
  };
  side1Finish: {
    sectionId: string;
    elementId: string;
    description: string;
  };
  side2Finish: {
    sectionId: string;
    elementId: string;
    description: string;
  };
}

export const wallLocationToElementalMap: Record<WallLocation, CostPlanMapping> = {
  "Internal Division": {
    structure: {
      sectionId: "internal-divisions",
      elementId: "walls",
      description: "Internal wall structure",
    },
    side1Finish: {
      sectionId: "internal-wall-finishes",
      elementId: "wall-finishes",
      description: "Internal wall finishes",
    },
    side2Finish: {
      sectionId: "internal-wall-finishes",
      elementId: "wall-finishes",
      description: "Internal wall finishes",
    },
  },
  "External Envelope": {
    structure: {
      sectionId: "external-facade",
      elementId: "external-walls",
      description: "External wall structure",
    },
    side1Finish: {
      sectionId: "internal-wall-finishes",
      elementId: "wall-finishes",
      description: "Internal wall finishes",
    },
    side2Finish: {
      sectionId: "external-facade",
      elementId: "external-finishes",
      description: "External wall finishes",
    },
  },
  "Boundary / Retaining Wall": {
    structure: {
      sectionId: "boundary-walls",
      elementId: "boundary-walls-structure",
      description: "Boundary wall structure",
    },
    side1Finish: {
      sectionId: "boundary-walls",
      elementId: "boundary-finishes",
      description: "Boundary wall finishes",
    },
    side2Finish: {
      sectionId: "boundary-walls",
      elementId: "boundary-finishes",
      description: "Boundary wall finishes",
    },
  },
};

export function getCostPlanMapping(wallLocation: WallLocation): CostPlanMapping {
  return wallLocationToElementalMap[wallLocation];
}