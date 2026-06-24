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