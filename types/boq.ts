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
  elementalSectionId?: string;   // e.g., "internal-divisions"
  elementalElementId?: string;   // e.g., "walls"
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