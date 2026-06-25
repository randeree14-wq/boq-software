"use client";

import type { ElementalSection, ElementalElement } from "@/types/elemental";

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
        children: [
          { id: "external-walls", name: "External Walls", status: "coming-soon" },
          { id: "external-finishes", name: "External Finishes", status: "coming-soon" },
        ],
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
        id: "internal-wall-finishes",
        name: "Internal Wall Finishes",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Plaster, paint, tiles, etc.",
      },
      {
        id: "boundary-walls",
        name: "Boundary / Retaining Walls",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Boundary walls, retaining walls, etc.",
        children: [
          { id: "boundary-walls-structure", name: "Boundary Wall Structure", status: "coming-soon" },
          { id: "boundary-finishes", name: "Boundary Wall Finishes", status: "coming-soon" },
        ],
      },
      {
        id: "floor-finishes",
        name: "Floor Finishes",
        status: "coming-soon",
        moduleKey: undefined,
        description: "Floor coverings, screeds, etc.",
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
    // Check top-level elements
    const found = section.elements.find((el) => el.id === id);
    if (found) return found;
    // Check children (if any)
    for (const el of section.elements) {
      if (el.children) {
        const childFound = el.children.find((child) => child.id === id);
        if (childFound) return childFound;
      }
    }
  }
  return undefined;
}

// Helper to get a section by id
export function getSectionById(id: string) {
  for (const section of elementalStructure) {
    if (section.id === id) return section;
  }
  return undefined;
}

// Helper to get section name from element id
export function getSectionNameByElementId(elementId: string): string {
  for (const section of elementalStructure) {
    // Check top-level elements
    const found = section.elements.find((el) => el.id === elementId);
    if (found) return section.name;
    // Check children
    for (const el of section.elements) {
      if (el.children) {
        const childFound = el.children.find((child) => child.id === elementId);
        if (childFound) return section.name;
      }
    }
  }
  return "Uncategorised";
}