// lib/projectStorage.ts
import { ProjectData } from "@/types/boq";
import { DEFAULT_ELEMENTS } from "@/lib/domain";

const STORAGE_KEY = "boqProjectData";

export function saveProjectData(data: ProjectData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProjectData(): ProjectData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<ProjectData>;
    // Provide defaults for new fields
    return {
      // Existing fields
      beamTypes: data.beamTypes || [],
      beamMeasurements: data.beamMeasurements || [],
      surfaceBedTypes: data.surfaceBedTypes || [],
      surfaceBedMeasurements: data.surfaceBedMeasurements || [],
      padFootingTypes: data.padFootingTypes || [],
      padFootingMeasurements: data.padFootingMeasurements || [],
      groundBeamTypes: data.groundBeamTypes || [],
      groundBeamMeasurements: data.groundBeamMeasurements || [],
      columnTypes: data.columnTypes || [],
      columnMeasurements: data.columnMeasurements || [],
      wallTypes: data.wallTypes || [],
      wallMeasurements: data.wallMeasurements || [],
      slabTypes: data.slabTypes || [],
      slabMeasurements: data.slabMeasurements || [],
      openingTypes: data.openingTypes || [],
      openingMeasurements: data.openingMeasurements || [],
      rates: data.rates || {},
      costPlanComponents: data.costPlanComponents || [],
      executiveInput: data.executiveInput || {
        projectName: "My Project",
        baseDate: new Date().toISOString().split("T")[0],
        buildingArea: 0,
        specialistServices: [],
        preliminaries: 0,
        preliminariesPercent: 0,
        contingency: 0,
        contingencyPercent: 0,
        escalations: {
          preConstructionMonths: 6,
          preConstructionRate: 5,
          constructionMonths: 12,
          constructionRate: 8,
        },
        professionalFees: {
          coreConsultants: 0,
          specialistConsultants: 0,
          disbursements: 0,
        },
      },
      // NEW fields with defaults:
      costPlans: data.costPlans || [],
      measurementItems: data.measurementItems || [],
      elements: data.elements || DEFAULT_ELEMENTS,
      snapshots: data.snapshots || [],
    };
  } catch {
    return null;
  }
}

export function clearProjectData(): void {
  localStorage.removeItem(STORAGE_KEY);
}