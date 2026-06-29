// ============================================
// LEVEL 1: COST PLAN ENGINE
// ============================================

export type CostPlan = {
  id: string;
  name: string;
  type: "floor" | "zone" | "package";
  gfa_m2: number;
  multiplier?: number;
  items: CostPlanItem[];
};

export type CostPlanItem = {
  id: string;
  description: string;
  elementCode: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
};

// ============================================
// LEVEL 2: ELEMENTAL SUMMARY (PER COST PLAN)
// ============================================

export type ElementalSummary = {
  costPlanId: string;
  elements: ElementalSummaryItem[];
  totalValue: number;
};

export type ElementalSummaryItem = {
  name: string;
  code: string;
  value: number;
  percentageOfCostPlan: number;
};

// ============================================
// LEVEL 3: EXECUTIVE SUMMARY (PROJECT-WIDE)
// ============================================

export type ExecutiveSummary = {
  projectName: string;
  totalGFA: number;
  baseDate: string;
  costPlanLines: ProjectCostLine[];
  costPlanTotal: number;
  specialistServices: {
    items: SpecialistServiceItem[];
    totalValue: number;
  };
  preliminaries: number;
  contingency: number;
  estimatedCurrentConstructionCost: number;
  escalations: EscalationData;
  escalationAmount: number;
  estimatedConstructionCostAtCompletion: number;
  professionalFees: {
    coreConsultants: number;
    specialistConsultants: number;
    disbursements: number;
    total: number;
  };
  estimatedDevelopmentCostAtCompletion: number;
};

export type ProjectCostLine = {
  name: string;
  value: number;
  projectRatePerM2: number;
  percentageOfTotalProject: number;
};

export type SpecialistServiceItem = {
  id: string;
  category: string;
  name: string;
  value: number;
  ratePerM2: number;
  percentageOfProject: number;
};

export type EscalationData = {
  preConstructionMonths: number;
  preConstructionRate: number;
  constructionMonths: number;
  constructionRate: number;
};

export type ProfessionalFeeItem = {
  name: string;
  value: number;
  percentageOfConstructionCost: number;
};

export type ExecutiveSummary = {
  projectName: string;
  totalGFA: number;
  baseDate: string;
  
  // Cost Plan Roll-up
  costPlanLines: ProjectCostLine[];
  costPlanTotal: number;
  
  // Specialist Services
  specialistServices: {
    items: SpecialistServiceItem[];
    totalValue: number;
  };
  
  // Preliminaries
  preliminaries: number;
  
  // Contingencies
  contingency: number;
  
  // Construction Cost
  estimatedCurrentConstructionCost: number;
  
  // Escalations
  escalations: EscalationData;
  escalationAmount: number;
  estimatedConstructionCostAtCompletion: number;
  
  // Professional Fees
  professionalFees: {
    coreConsultants: number;
    specialistConsultants: number;
    disbursements: number;
    total: number;
  };
  
  // Final Output
  estimatedDevelopmentCostAtCompletion: number;
};

export type BeamProfileType = 
  | "Downstand Beam"
  | "Upstand Beam"
  | "Perimeter Beam (Downstand Only)"
  | "Perimeter Beam (Downstand + Upstand)"
  | "Combined Downstand / Inverted Beam"
  | "Integrated Beam / No Separate Beam Formwork";

// Update BeamType to include slabThicknessMm for combined beams
export type BeamType = {
  id: number;
  name: string;
  width?: number;           // <-- optional
  depth?: number;           // <-- optional
  reinfKg?: number;         // <-- optional
  formworkFinish: string;
  concreteClass: string;
  beamProfileType: BeamProfileType;
  beamWidthMm?: number;     // <-- optional
  downstandDepthMm?: number; // <-- optional
  upstandHeightMm?: number;  // <-- optional
  slabThicknessMm?: number;  // <-- optional
  proppingHeightBand: ProppingHeightBand;
  customProppingHeightDescription?: string;
};

export type BeamMeasurement = {
  id: number;
  mark: string;
  beamTypeId: number;
  length: number;
  elementalSectionId?: string;   // e.g., "structural-frame"
  elementalElementId?: string;   // e.g., "beams"
};

export type SurfaceBedType = {
  id: number;
  name: string;
  category: string;
  thickness: number;
  concreteClass: string;
  meshType: string;
  dpm: boolean;
  soilPoison: boolean;
  layer1Material: string;
  layer1Thickness: number;
  layer2Material: string;
  layer2Thickness: number;
  layer3Material: string;
  layer3Thickness: number;
  powerfloat: boolean;
  screedRequired: boolean;
  screedThickness: number;
  screedType: string;
  tileRequired: boolean;
  tilePcSum: number;
};

export type SurfaceBedMeasurement = {
  id: number;
  mark: string;
  surfaceBedTypeId: number;
  area: number;
  elementalSectionId?: string;   // e.g., "ground-floor"
  elementalElementId?: string;   // e.g., "solid-floors"
};

export type PadFootingType = {
  id: number;
  name: string;
  padLength: number;
  padWidth: number;
  padDepth: number;
  excavationLength: number;
  excavationWidth: number;
  concreteClass: string;
  reinfKg: number;
  formworkRequired: boolean;
  blindingRequired: boolean;
  blindingThickness: number;
  soilPoison: boolean;
  backfill: boolean;
  workingSpaceRequired?: boolean;
  riskOfCollapseRequired?: boolean;
  excavationDepth: number; 
};

export type PadFootingMeasurement = {
  id: number;
  mark: string;
  padFootingTypeId: number;
  quantity: number;
  elementalSectionId?: string;   // e.g., "substructure"
  elementalElementId?: string;   // e.g., "pad-footings"
};

export type GroundBeamType = {
  id: number;
  name: string;
  trenchWidth: number;
  trenchDepth: number;
  beamWidth: number;
  beamDepth: number;
  concreteClass: string;
  reinfKgPerM3: number;
  formworkRequired: boolean;
  blindingRequired: boolean;
  blindingThickness: number;
  backfillRequired: boolean;
  dpcRequired: boolean;
  soilPoisonRequired: boolean;
  workingSpaceRequired?: boolean;
  riskOfCollapseRequired?: boolean;
  excavationDepth: number; 
};

export type GroundBeamMeasurement = {
  id: number;
  mark: string;
  groundBeamTypeId: number;
  length: number;
  elementalSectionId?: string;   // e.g., "substructure"
  elementalElementId?: string;   // e.g., "ground-beams"
};

export type ColumnType = {
  id: number;
  name: string;
  width: number;
  depth: number;
  height: number;
  concreteClass: string;
  reinfKgPerM3: number;
  formworkRequired: boolean;
  formworkFinish: string;
};

export type ColumnMeasurement = {
  id: number;
  mark: string;
  columnTypeId: number;
  quantity: number;
  elementalSectionId?: string;   // e.g., "structural-frame"
  elementalElementId?: string;   // e.g., "columns"
};

export type BeamFormType = "Downstand beam" | "Perimeter downstand beam" | "Upstand beam" | "Integrated slab beam / no beam formwork";
export type FormworkMeasurement = "Sides and soffit together" | "Sides only" | "Soffit only" | "None";
export type ProppingHeightBand = 
  | "Not exceeding 1.5m" 
  | "Exceeding 1.5m and not exceeding 3.5m" 
  | "Exceeding 3.5m and not exceeding 5.0m" 
  | "Exceeding 5.0m and not exceeding 6.5m" 
  | "Custom";


export type BrickType = "Common" | "Imperial" | "Maxi 90";

export type WallThicknessType = "Single Skin (Half Brick)" | "Double Skin (One Brick)" | "Cavity Wall" | "Triple Skin";

export type WallFinish = "None" | "Paint" | "Tile";

export type WallType = {
  id: number;
  name: string;
  brickType: BrickType;
  thicknessType: WallThicknessType;
  thicknessMm: number;
  courseHeight: number;
  // Side 1
  side1Plaster: boolean;
  side1Finish: WallFinish;
  side1TilePcSum?: number; // only if side1Finish === "Tile"
  // Side 2
  side2Plaster: boolean;
  side2Finish: WallFinish;
  side2TilePcSum?: number; // only if side2Finish === "Tile"
  // Other fields
  dpcRequired: boolean;
  reinforcementRequired: boolean;
  coursesPerReinforcement: number;
  reinforcementType: string;
};

export type WallMeasurement = {
  id: number;
  mark: string;
  wallTypeId: number;
  length: number;
  height: number;
  area: number;
  wallLocation: WallLocation;
  elementalSectionId?: string;   // e.g., "internal-divisions"
  elementalElementId?: string;   // e.g., "walls"
};

export type WallLocation = "Internal Division" | "External Envelope" | "Boundary / Retaining Wall";

export type CostPlanComponent = {
  id: string; // Unique identifier
  measurementId: number; // Reference to source measurement
  mark: string;
  module: string;
  elementalSectionId: string;
  elementalElementId: string;
  description: string;
  unit: string;
  qty: number;
  rate?: number;
  amount?: number;
};

export type SlabType = {
  id: number;
  name: string;
  thickness: number;
  concreteClass: string;
  reinfType: "Mesh" | "Rebar";
  reinfKgPerM3: number;
  meshType?: string;
  formworkToEdges: boolean;
  screedRequired: boolean;
  screedThickness: number;
  floorFinishPcSum: number;
  floorFinishDescription: string;
};

export type SlabMeasurement = {
  id: number;
  mark: string;
  slabTypeId: number;
  length: number;
  width: number;
  quantity: number;
  area: number;
  elementalSectionId?: string;   // e.g., "structural-frame"
  elementalElementId?: string;   // e.g., "slabs"
};

// ============================================
// UPDATED BOQ ITEM TYPE
// ============================================
export type BoqItem = {
  billNo: string;
  billName: string;
  section: string;
  description: string;
  unit: string;
  qty: number;
  contributions: Array<{
    module: string;
    measurementId: number;
    mark: string;
    qty: number;
  }>;
  rate?: number;    // <-- NEW
  amount?: number;  // <-- NEW (calculated as qty * rate)
};

// ============================================
// PROJECT DATA TYPE
// ============================================
export type ProjectData = {
  beamTypes: BeamType[];
  beamMeasurements: BeamMeasurement[];
  surfaceBedTypes: SurfaceBedType[];
  surfaceBedMeasurements: SurfaceBedMeasurement[];
  padFootingTypes: PadFootingType[];
  padFootingMeasurements: PadFootingMeasurement[];
  groundBeamTypes: GroundBeamType[];
  groundBeamMeasurements: GroundBeamMeasurement[];
  columnTypes: ColumnType[];
  columnMeasurements: ColumnMeasurement[];
  wallTypes: WallType[];
  wallMeasurements: WallMeasurement[];
  slabTypes: SlabType[];
  slabMeasurements: SlabMeasurement[];
  rates: Record<string, number>; // <-- NEW: keyed by `${billNo}|${section}|${description}|${unit}`
  costPlanComponents: CostPlanComponent[];
};
// Add this type for type-safe bill references
export type BillKey = 
  | "PRELIMINARIES"
  | "DEMOLITIONS"
  | "ALTERATIONS"
  | "EARTHWORKS"
  | "LATERAL_SUPPORT"
  | "PILING"
  | "CONCRETE"
  | "PRECAST_CONCRETE"
  | "MASONRY"
  | "WATERPROOFING"
  | "ROOF_COVERINGS"
  | "CARPENTRY"
  | "CEILINGS"
  | "FLOOR_COVERINGS"
  | "IRONMONGERY"
  | "STRUCTURAL_STEEL"
  | "METALWORK"
  | "PLASTERING"
  | "TILING"
  | "PLUMBING"
  | "ELECTRICAL"
  | "MECHANICAL"
  | "GLAZING"
  | "PAINTWORK"
  | "PAPERHANGING"
  | "EXTERNAL_WORK"
  | "PROVISIONAL_SUMS"
  | "FINAL_SUMMARY";

  // ============================================
// Openings (Doors & Windows)
// ============================================

export type DoorConfiguration = "Single" | "Double" | "Sliding" | "Folding" | "Roller shutter";
export type DoorLeafType =
  | "Hollow core timber door"
  | "Semi-solid timber door"
  | "Solid timber door"
  | "Aluminium door"
  | "Fire door"
  | "Steel door";
export type DoorFrameType = "Timber frame" | "Steel frame" | "Aluminium frame";

export type WindowType = "Aluminium window" | "Steel window" | "Timber window";
export type WindowFrameType = "Aluminium" | "Steel" | "Timber";

export type WallThicknessOption = "Half brick" | "One brick" | "Other mm";

export type OpeningType = {
  id: number;
  name: string;
  category: "Door" | "Window";
  // Common
  widthMm: number;
  heightMm: number;
  quantity: number; // default 1, but can be overridden in measurement
  wallThicknessOption: WallThicknessOption;
  wallThicknessMm?: number; // only used if "Other mm"
  includeLintel: boolean;
  lintelBearingMm: number; // default 230
  includeRevealPlaster: boolean;
  // Door-specific
  doorConfiguration?: DoorConfiguration;
  doorLeafType?: DoorLeafType;
  doorFrameType?: DoorFrameType;
  paintDoor?: boolean;
  paintFrame?: boolean;
  includeIronmongery?: boolean;
  includeThreshold?: boolean;
  // Window-specific
  windowType?: WindowType;
  windowFrameType?: WindowFrameType;
  externalSill?: boolean;
  internalSill?: boolean;
};

export type OpeningMeasurement = {
  id: number;
  mark: string;
  openingTypeId: number;
  quantity?: number; // overrides type.quantity
  linkedWallId?: number; // for future wall deduction
  elementalSectionId?: string;   // e.g., "internal-divisions"
  elementalElementId?: string;   // e.g., "openings"
};

export type ProjectData = {
  openingTypes: OpeningType[];
  openingMeasurements: OpeningMeasurement[];
};

// ============================================
// MEASUREMENT OUTPUT ENGINE
// ============================================

export type MeasurementOutput = {
  id: string;
  sourceModule: string;
  sourceMeasurementId: number;
  sourceMark: string;
  outputType: "cost-plan" | "boq";
  sectionId?: string;
  elementId?: string;
  componentId?: string;
  componentName: string;
  description: string;
  unit: string;
  qty: number;
  rate?: number;
  amount?: number;
};

// Helper type for output generation context
export type OutputContext = {
  measurementId: number;
  mark: string;
  module: string;
  sectionId: string;
  elementId: string;
};

// ============================================
// SPECIALIST SERVICES
// ============================================

export type SpecialistServiceItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  value: number;              // Total value (calculated from rate/m² or lump sum)
  ratePerM2: number;          // Optional: rate per m²
  lumpSum: number;            // Optional: fixed lump sum
  unit: "m²" | "lump";        // How it's calculated
  percentageOfProject: number; // Calculated by engine
};

// Default specialist service categories
export const SPECIALIST_CATEGORIES = {
  ELECTRICAL: "Electrical Installation",
  ELECTRONIC: "Electronic Installation",
  AIRCONDITIONING: "Air Conditioning",
  LIFT: "Lift Installation",
  TENANT: "Tenant Installation",
  CONTRACTOR: "Contractor Items",
  OTHER: "Other",
} as const;

export type SpecialistCategory = keyof typeof SPECIALIST_CATEGORIES;

// ============================================
// EXECUTIVE SUMMARY INPUT (Persisted)
// ============================================

export type ProfessionalFees = {
  coreConsultants: number;
  specialistConsultants: number;
  disbursements: number;
};

export type ExecutiveSummaryInputData = {
  projectName: string;
  baseDate: string;
  buildingArea: number;
  specialistServices: SpecialistServiceItem[];
  preliminaries: number;
  contingency: number;
  escalations: EscalationData;
  professionalFees: ProfessionalFees;
};

// Update ProjectData to include executiveInput
export type ProjectData = {
  // ... existing fields (beamTypes, beamMeasurements, etc.)
  // ... rates, costPlanComponents
  executiveInput: ExecutiveSummaryInputData;
};