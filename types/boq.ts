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

export type BoqItem = {
  item: string;
  unit: string;
  qty: number;
};