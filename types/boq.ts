export type BeamType = {
  id: number;
  name: string;
  width: number;
  depth: number;
  reinfKg: number;
  formworkFinish: string;
  concreteClass: string;
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

export type BoqItem = {
  item: string;
  unit: string;
  qty: number;
};