export type ElementStatus = "active" | "coming-soon";

export type ElementalElement = {
  id: string;
  name: string;
  status: ElementStatus;
  moduleKey?: string; // maps to the module component name
  description?: string;
};

export type ElementalSection = {
  id: string;
  name: string;
  elements: ElementalElement[];
};

// In elementalStructure.ts, add new elements:
{
  id: "external-facade",
  name: "External Facade",
  status: "coming-soon",
  moduleKey: undefined,
  description: "External walls, cladding, windows, etc.",
},
{
  id: "external-finishes",
  name: "External Finishes",
  status: "coming-soon",
  moduleKey: undefined,
  description: "External wall finishes, render, paint, etc.",
},
{
  id: "internal-wall-finishes",
  name: "Internal Wall Finishes",
  status: "coming-soon",
  moduleKey: undefined,
  description: "Internal wall finishes, plaster, paint, tiles, etc.",
},
{
  id: "boundary-walls",
  name: "Boundary / Retaining Walls",
  status: "coming-soon",
  moduleKey: undefined,
  description: "Boundary walls, retaining walls, etc.",
},