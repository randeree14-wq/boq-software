// lib/boqStructure.ts

// ============================================
// ASAQS Bill Structure
// ============================================

export const BILLS = {
  PRELIMINARIES: { billNo: "1", billName: "PRELIMINARIES" },
  DEMOLITIONS: { billNo: "2", billName: "DEMOLITIONS" },
  ALTERATIONS: { billNo: "3", billName: "ALTERATIONS" },
  EARTHWORKS: { billNo: "4", billName: "EARTHWORKS" },
  LATERAL_SUPPORT: { billNo: "5", billName: "LATERAL SUPPORT" },
  PILING: { billNo: "6", billName: "PILING" },
  CONCRETE: { billNo: "7", billName: "CONCRETE, FORMWORK AND REINFORCEMENT" },
  PRECAST_CONCRETE: { billNo: "8", billName: "PRECAST CONCRETE" },
  MASONRY: { billNo: "9", billName: "MASONRY" },
  WATERPROOFING: { billNo: "10", billName: "WATERPROOFING" },
  ROOF_COVERINGS: { billNo: "11", billName: "ROOF COVERINGS, CLADDINGS, ETC." },
  CARPENTRY: { billNo: "12", billName: "CARPENTRY AND JOINERY" },
  CEILINGS: { billNo: "13", billName: "CEILINGS, PARTITIONS, ETC." },
  FLOOR_COVERINGS: { billNo: "14", billName: "FLOOR COVERINGS, ETC." },
  IRONMONGERY: { billNo: "15", billName: "IRONMONGERY" },
  STRUCTURAL_STEEL: { billNo: "16", billName: "STRUCTURAL STEELWORK" },
  METALWORK: { billNo: "17", billName: "METALWORK" },
  PLASTERING: { billNo: "18", billName: "PLASTERING" },
  TILING: { billNo: "19", billName: "TILING" },
  PLUMBING: { billNo: "20", billName: "PLUMBING AND DRAINAGE" },
  ELECTRICAL: { billNo: "21", billName: "ELECTRICAL WORK" },
  MECHANICAL: { billNo: "22", billName: "MECHANICAL WORK" },
  GLAZING: { billNo: "23", billName: "GLAZING" },
  PAINTWORK: { billNo: "24", billName: "PAINTWORK" },
  PAPERHANGING: { billNo: "25", billName: "PAPERHANGING" },
  EXTERNAL_WORK: { billNo: "26", billName: "EXTERNAL WORK" },
  PROVISIONAL_SUMS: { billNo: "27", billName: "PROVISIONAL SUMS" },
  FINAL_SUMMARY: { billNo: "28", billName: "FINAL SUMMARY" },
} as const;

// ============================================
// Sections (common across multiple bills)
// ============================================

export const SECTIONS = {
  // Earthworks
  EXCAVATION: "Excavation",
  BACKFILLING: "Backfilling",
  LAYERWORKS: "Layerworks",
  BLINDING: "Blinding",
  SOIL_POISONING: "Soil Poisoning",

  // Concrete, Formwork and Reinforcement
  CONCRETE: "Concrete",
  FORMWORK: "Formwork",
  REINFORCEMENT: "Reinforcement",

  // Masonry
  BRICKWORK: "Brickwork",
  DAMP_PROOF_COURSES: "Damp Proof Courses",
  MASONRY_REINFORCEMENT: "Reinforcement",

  // Waterproofing
  TANKING: "Tanking",
  DPM: "Damp Proof Membrane",

  // Finishes (split across multiple bills)
  PLASTER: "Plaster",
  TILING: "Tiling",
  PAINT: "Paint",
  SCREEDS: "Screeds",
  FLOOR_FINISHES: "Floor Finishes",

    // openings
  LINTELS: "Lintels",
  NARROW_WIDTHS: "Narrow Widths",
  DOORS: "Doors",
  WINDOWS: "Windows",
  FRAMES: "Frames",
  SILLS: "Sills",
  IRONMONGERY: "Ironmongery",
} as const;

// ============================================
// Type for BillKey
// ============================================

export type BillKey = keyof typeof BILLS;

// ============================================
// Helper to get bill by key
// ============================================

export function getBill(key: BillKey) {
  return BILLS[key];
}