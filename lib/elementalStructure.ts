import type { ElementalSection } from "@/types/elemental";

// Mapping from moduleKey to elemental section and element
export const moduleToElementalMap: Record<string, { sectionId: string; elementId: string }> = {
  "beam": { sectionId: "structural-frame", elementId: "beams" },
  "surface-bed": { sectionId: "ground-floor", elementId: "solid-floors" },
  "pad-footing": { sectionId: "substructure", elementId: "pad-footings" },
  "ground-beam": { sectionId: "substructure", elementId: "ground-beams" },
  "column": { sectionId: "structural-frame", elementId: "columns" },
  "slab": { sectionId: "structural-frame", elementId: "slabs" },
  "wall": { sectionId: "internal-divisions", elementId: "walls" },
  "opening": { sectionId: "internal-divisions", elementId: "openings" },
};

export function getElementalLocation(moduleKey: string): { sectionId: string; elementId: string } | undefined {
  return moduleToElementalMap[moduleKey];
}

export const elementalStructure: ElementalSection[] = [
  {
    id: "primary-elements",
    name: "Primary Elements",
    elements: [
      {
        id: "substructure",
        name: "Substructure",
        status: "active",
        moduleKey: "substructure",
        description: "Pad Footings, Ground Beams, etc.",
      },
      {
        id: "ground-floor",
        name: "Ground Floor",
        status: "active",
        moduleKey: "ground-floor",
        description: "Surface Beds, Floor Finishes, etc.",
      },
      {
        id: "structural-frame",
        name: "Structural Frame",
        status: "active",
        moduleKey: "structural-frame",
        description: "Columns, Beams, Slabs, etc.",
      },
      {
        id: "external-facade",
        name: "External Facade",
        status: "coming-soon",
        moduleKey: undefined,
        description: "External walls, cladding, windows, etc.",
      },
      {
        id: "roofs",
        name: "Roofs",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Roof structure, coverings, etc.",
      },
      {
        id: "internal-divisions",
        name: "Internal Divisions",
        status: "active",
        moduleKey: "internal-divisions",
        description: "Walls, Openings, etc.",
      },
      {
        id: "floor-finishes",
        name: "Floor Finishes",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Floor coverings, screeds, etc.",
      },
      {
        id: "internal-wall-finishes",
        name: "Internal Wall Finishes",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Plaster, paint, tiles, etc.",
      },
      {
        id: "ceiling-finishes",
        name: "Ceiling Finishes",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Ceiling types, finishes, etc.",
      },
    ],
  },
  {
    id: "specialist-installations",
    name: "Specialist Installations",
    elements: [
      {
        id: "special-foundations",
        name: "Special Foundations",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Piling, raft foundations, etc.",
      },
    ],
  },
  // Add more sections as needed, all "coming-soon" for now
];

// Helper to get active elements
export function getActiveElements(): ElementalElement[] {
  const active: ElementalElement[] = [];
  elementalStructure.forEach((section) => {
    section.elements.forEach((element) => {
      if (element.status === "active") {
        active.push(element);
      }
    });
  });
  return active;
}

// Helper to get an element by id
export function getElementById(id: string): ElementalElement | undefined {
  for (const section of elementalStructure) {
    const found = section.elements.find((el) => el.id === id);
    if (found) return found;
  }
  return undefined;
}