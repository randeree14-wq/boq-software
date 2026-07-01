import { Element } from "@/types/boq";

export const DEFAULT_ELEMENTS: Element[] = [
  { id: "elem-1", name: "Substructure", category: "substructure", code: "SUB-01", order: 1, isActive: true },
  { id: "elem-2", name: "Ground Floor Construction", category: "substructure", code: "SUB-02", order: 2, isActive: true },
  { id: "elem-3", name: "Structural Frame", category: "superstructure", code: "SS-01", order: 3, isActive: true },
  { id: "elem-4", name: "Columns", category: "superstructure", code: "SS-02", order: 4, isActive: true },
  { id: "elem-5", name: "Beams", category: "superstructure", code: "SS-03", order: 5, isActive: true },
  { id: "elem-6", name: "Slabs", category: "superstructure", code: "SS-04", order: 6, isActive: true },
  { id: "elem-7", name: "External Envelope", category: "superstructure", code: "SS-05", order: 7, isActive: true },
  { id: "elem-8", name: "Internal Divisions", category: "superstructure", code: "SS-06", order: 8, isActive: true },
  { id: "elem-9", name: "Floor Finishes", category: "finishes", code: "FIN-01", order: 9, isActive: true },
  { id: "elem-10", name: "Wall Finishes", category: "finishes", code: "FIN-02", order: 10, isActive: true },
  { id: "elem-11", name: "Services", category: "services", code: "SVC-01", order: 11, isActive: true },
  { id: "elem-12", name: "External Works", category: "external", code: "EXT-01", order: 12, isActive: true },
];

export function getElementById(id: string, elements: Element[] = DEFAULT_ELEMENTS): Element | undefined {
  return elements.find(e => e.id === id);
}

export function getElementsByCategory(category: string, elements: Element[] = DEFAULT_ELEMENTS): Element[] {
  return elements.filter(e => e.category === category && e.isActive);
}

export function getActiveElements(elements: Element[] = DEFAULT_ELEMENTS): Element[] {
  return elements.filter(e => e.isActive);
}