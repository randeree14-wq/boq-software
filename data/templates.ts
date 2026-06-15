export type Template = {
  id: number;
  name: string;
  type: "beam" | "slab";
  width?: number;
  depth?: number;
  thickness?: number;
  reinfKg: number;
};

export const templates: Template[] = [
  {
    id: 1,
    name: "230 x 500 RC Beam",
    type: "beam",
    width: 0.23,
    depth: 0.5,
    reinfKg: 120,
  },
  {
    id: 2,
    name: "300 x 600 RC Beam",
    type: "beam",
    width: 0.3,
    depth: 0.6,
    reinfKg: 150,
  },
  {
    id: 3,
    name: "255mm RC Slab",
    type: "slab",
    thickness: 0.255,
    reinfKg: 35,
  },
];