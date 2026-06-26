import type {
  WallType,
  SlabType,
  PadFootingType,
  GroundBeamType,
  ColumnType,
  SurfaceBedType,
  OpeningType,
  BeamType,
} from "@/types/boq";

export const beamDefaults: Omit<BeamType, "id"> = {
  name: "",
  width: 0,
  depth: 0,
  reinfKg: 0,
  formworkFinish: "Smooth",
  concreteClass: "25MPa/19mm",
  beamProfileType: "Downstand Beam",
  beamWidthMm: 0,
  downstandDepthMm: 0,
  upstandHeightMm: 0,
  slabThicknessMm: 0,
  proppingHeightBand: "Not exceeding 1.5m",
  customProppingHeightDescription: "",
};

export const beamMeasurementDefaults = {
  mark: "",
  beamTypeId: 0,
  length: 0,
};

export const wallDefaults: Omit<WallType, "id"> = {
  name: "",
  brickType: "Common",
  thicknessType: "Single Skin (Half Brick)",
  thicknessMm: 0,
  courseHeight: 75,
  side1Plaster: true,
  side1Finish: "Paint",
  side1TilePcSum: 0,
  side2Plaster: true,
  side2Finish: "Paint",
  side2TilePcSum: 0,
  dpcRequired: true,
  reinforcementRequired: false,
  coursesPerReinforcement: 4,
  reinforcementType: "Galvanised mesh",
};

export const wallMeasurementDefaults = {
  mark: "",
  wallTypeId: 0,
  length: 0,
  height: 0,
  area: 0,
  wallLocation: "Internal Division" as const,
};

export const slabDefaults: Omit<SlabType, "id"> = {
  name: "",
  thickness: 0,
  concreteClass: "30MPa/19mm",
  reinfType: "Rebar",
  reinfKgPerM3: 0,
  meshType: "A193",
  formworkToEdges: true,
  screedRequired: false,
  screedThickness: 0,
  floorFinishPcSum: 0,
  floorFinishDescription: "Tiles",
};

export const slabMeasurementDefaults = {
  mark: "",
  slabTypeId: 0,
  length: 0,
  width: 0,
  quantity: 0,
  area: 0,
};

export const padFootingDefaults: Omit<PadFootingType, "id"> = {
  name: "",
  padLength: 0,
  padWidth: 0,
  padDepth: 0,
  excavationLength: 0,
  excavationWidth: 0,
  excavationDepth: 0,
  concreteClass: "30MPa/19mm",
  reinfKg: 0,
  formworkRequired: true,
  blindingRequired: true,
  blindingThickness: 0,
  soilPoison: false,
  backfill: true,
  workingSpaceRequired: false,
  riskOfCollapseRequired: false,
};

export const padFootingMeasurementDefaults = {
  mark: "",
  padFootingTypeId: 0,
  quantity: 0,
};

export const groundBeamDefaults: Omit<GroundBeamType, "id"> = {
  name: "",
  trenchWidth: 0,
  trenchDepth: 0,
  beamWidth: 0,
  beamDepth: 0,
  concreteClass: "30MPa/19mm",
  reinfKgPerM3: 0,
  formworkRequired: true,
  blindingRequired: true,
  blindingThickness: 0,
  backfillRequired: true,
  dpcRequired: false,
  soilPoisonRequired: false,
  workingSpaceRequired: false,
  riskOfCollapseRequired: false,
};

export const groundBeamMeasurementDefaults = {
  mark: "",
  groundBeamTypeId: 0,
  length: 0,
};

export const columnDefaults: Omit<ColumnType, "id"> = {
  name: "",
  width: 0,
  depth: 0,
  height: 0,
  concreteClass: "35MPa/19mm",
  reinfKgPerM3: 0,
  formworkRequired: true,
  formworkFinish: "Smooth",
};

export const columnMeasurementDefaults = {
  mark: "",
  columnTypeId: 0,
  quantity: 0,
};

export const surfaceBedDefaults: Omit<SurfaceBedType, "id"> = {
  name: "",
  category: "Internal",
  thickness: 0,
  concreteClass: "35MPa/19mm",
  meshType: "Ref193",
  dpm: true,
  soilPoison: true,
  layer1Material: "",
  layer1Thickness: 0,
  layer2Material: "",
  layer2Thickness: 0,
  layer3Material: "",
  layer3Thickness: 0,
  powerfloat: true,
  screedRequired: false,
  screedThickness: 0,
  screedType: "Normal",
  tileRequired: false,
  tilePcSum: 0,
};

export const surfaceBedMeasurementDefaults = {
  mark: "",
  surfaceBedTypeId: 0,
  area: 0,
};

export const openingDefaults: Omit<OpeningType, "id"> = {
  name: "",
  category: "Door",
  widthMm: 0,
  heightMm: 0,
  quantity: 0,
  wallThicknessOption: "Half brick",
  wallThicknessMm: 0,
  includeLintel: true,
  lintelBearingMm: 230,
  includeRevealPlaster: true,
  doorConfiguration: "Single",
  doorLeafType: "Hollow core timber door",
  doorFrameType: "Timber frame",
  paintDoor: false,
  paintFrame: false,
  includeIronmongery: false,
  includeThreshold: false,
  windowType: "Aluminium window",
  windowFrameType: "Aluminium",
  externalSill: false,
  internalSill: false,
};

export const openingMeasurementDefaults = {
  mark: "",
  openingTypeId: 0,
  quantity: 0,
  linkedWallId: 0,
};