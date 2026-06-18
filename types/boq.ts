export type BeamType = {
  id: number;
  name: string;
  width: number;
  depth: number;
  reinfKg: number;
  formworkFinish: string;
  concreteClass: string;
  beamFormType: BeamFormType;
  formworkMeasurement: FormworkMeasurement;
  proppingHeightBand: ProppingHeightBand;
  customProppingHeightDescription?: string; // only used if proppingHeightBand is "Custom"
};

export type BeamMeasurement = {
  id: number;
  mark: string;
  beamTypeId: number;
  length: number;
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
};

export type PadFootingType = {
  id: number;
  name: string;
  padLength: number;
  padWidth: number;
  padDepth: number;
  excavationLength: number;
  excavationWidth: number;
  excavationDepth: number;
  concreteClass: string;
  reinfKg: number;
  formworkRequired: boolean;
  blindingRequired: boolean;
  blindingThickness: number;
  soilPoison: boolean;
  backfill: boolean;
};

export type PadFootingMeasurement = {
  id: number;
  mark: string;
  padFootingTypeId: number;
  quantity: number;
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
};

export type GroundBeamMeasurement = {
  id: number;
  mark: string;
  groundBeamTypeId: number;
  length: number;
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

export type WallType = {
  id: number;
  name: string;
  brickType: BrickType;
  thicknessType: WallThicknessType;
  thicknessMm: number;
  courseHeight: number;
  plasterBothSides: boolean;
  plasterThickness: number;
  paintRequired: boolean;
  dpcRequired: boolean;
  reinforcementRequired: boolean;
  coursesPerReinforcement: number;
  reinforcementType: string;
  tilesInternal: boolean;
  tilesExternal: boolean;
  tilePcSumInternal: number;
  tilePcSumExternal: number;
};

export type WallMeasurement = {
  id: number;
  mark: string;
  wallTypeId: number;
  length: number;
  height: number;
  area: number;
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
  quantity: number; // overrides type.quantity
  linkedWallId?: number; // for future wall deduction
};

export type ProjectData = {
  openingTypes: OpeningType[];
  openingMeasurements: OpeningMeasurement[];
};