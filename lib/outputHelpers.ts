import { MeasurementOutput, OutputContext } from "@/types/boq";
import { SECTIONS } from "./boqStructure";

// Counter for unique IDs
let idCounter = 0;

// ============================================================
// SHARED OUTPUT HELPERS
// ============================================================

/**
 * Create a Cost Plan output
 */
export function createCostPlanOutput(
  context: OutputContext,
  componentName: string,
  description: string,
  unit: string,
  qty: number,
  sectionId?: string,
  elementId?: string,
  rate?: number
): MeasurementOutput {
  idCounter++;
  const baseId = componentName.toLowerCase().replace(/\s+/g, "-");
  return {
    id: `${context.measurementId}-${baseId}-${idCounter}`,
    sourceModule: context.module,
    sourceMeasurementId: context.measurementId,
    sourceMark: context.mark,
    outputType: "cost-plan",
    sectionId: sectionId || context.sectionId,
    elementId: elementId || context.elementId,
    componentId: baseId,
    componentName,
    description,
    unit,
    qty,
    rate,
    amount: rate !== undefined ? qty * rate : undefined,
  };
}

/**
 * Create a BOQ output
 */
export function createBoqOutput(
  context: OutputContext,
  componentName: string,
  description: string,
  unit: string,
  qty: number,
  billKey: string,
  section: string,
  rate?: number
): MeasurementOutput {
  idCounter++;
  const baseId = componentName.toLowerCase().replace(/\s+/g, "-");
  return {
    id: `${context.measurementId}-boq-${baseId}-${idCounter}`,
    sourceModule: context.module,
    sourceMeasurementId: context.measurementId,
    sourceMark: context.mark,
    outputType: "boq",
    sectionId: billKey,
    elementId: section,
    componentId: baseId,
    componentName,
    description,
    unit,
    qty,
    rate,
    amount: rate !== undefined ? qty * rate : undefined,
  };
}

// ============================================================
// REUSABLE COMPONENT HELPERS
// ============================================================

/**
 * Concrete component
 */
export function createConcreteOutputs(
  context: OutputContext,
  concreteClass: string,
  description: string,
  qty: number,
  strength?: string,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const safeQty = qty || 0;
  if (isNaN(safeQty) || safeQty === 0) return outputs;

  const strengthLabel = strength || concreteClass?.split('/')[0] || "Unknown";

  outputs.push(
    createCostPlanOutput(
      context,
      "Concrete",
      `${concreteClass} ${description}`,
      "m³",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Concrete",
      `${concreteClass} ${description}`,
      "m³",
      qty,
      "CONCRETE",
      `Concrete (${strengthLabel})`
    )
  );

  return outputs;
}

/**
 * Reinforcement component (Rebar)
 */
export function createRebarOutputs(
  context: OutputContext,
  concreteVol: number,
  reinfKgPerM3: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const totalReinf = (concreteVol * reinfKgPerM3) / 1000;
  const highTensile = totalReinf * 0.9;
  const mildSteel = totalReinf * 0.1;

  if (highTensile > 0) {
    outputs.push(
      createCostPlanOutput(
        context,
        "Reinforcement",
        "High tensile reinforcement",
        "t",
        highTensile,
        sectionId || context.sectionId,
        elementId || context.elementId
      )
    );
    outputs.push(
      createBoqOutput(
        context,
        "Reinforcement",
        "High tensile reinforcement",
        "t",
        highTensile,
        "CONCRETE",
        SECTIONS.REINFORCEMENT
      )
    );
  }

  if (mildSteel > 0) {
    outputs.push(
      createCostPlanOutput(
        context,
        "Reinforcement",
        "Mild steel reinforcement",
        "t",
        mildSteel,
        sectionId || context.sectionId,
        elementId || context.elementId
      )
    );
    outputs.push(
      createBoqOutput(
        context,
        "Reinforcement",
        "Mild steel reinforcement",
        "t",
        mildSteel,
        "CONCRETE",
        SECTIONS.REINFORCEMENT
      )
    );
  }

  return outputs;
}

/**
 * Reinforcement component (Mesh)
 */
export function createMeshOutputs(
  context: OutputContext,
  meshType: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Reinforcement",
      `Fabric reinforcement ${meshType}`,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Reinforcement",
      `Fabric reinforcement ${meshType}`,
      "m²",
      area,
      "CONCRETE",
      SECTIONS.REINFORCEMENT
    )
  );

  return outputs;
}

/**
 * Formwork component
 */
export function createFormworkOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Formwork",
      description,
      "m²",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Formwork",
      description,
      "m²",
      qty,
      "CONCRETE",
      SECTIONS.FORMWORK
    )
  );

  return outputs;
}

/**
 * Screed component
 * Goes to PLASTERING bill
 */
export function createScreedOutputs(
  context: OutputContext,
  thickness: number,
  screedType: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const description = `${thickness}mm screed ${screedType}`;

  outputs.push(
    createCostPlanOutput(
      context,
      "Screed",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Screed",
      description,
      "m²",
      area,
      "PLASTERING",
      SECTIONS.SCREEDS
    )
  );

  return outputs;
}

/**
 * Floor Finish component (for tiles, vinyl, etc.)
 * Goes to TILING bill
 */
export function createFloorFinishOutputs(
  context: OutputContext,
  description: string,
  pcSum: number,
  area: number,
  sectionId?: string,
  elementId?: string,
  isTiles: boolean = true
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const fullDescription = `${description} floor finish PC R${pcSum}/m²`;

  outputs.push(
    createCostPlanOutput(
      context,
      "Floor Finish",
      fullDescription,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId,
      pcSum
    )
  );

  const billKey = isTiles ? "TILING" : "FLOOR_COVERINGS";
  const section = isTiles ? SECTIONS.TILING : SECTIONS.FLOOR_FINISHES;
  
  outputs.push(
    createBoqOutput(
      context,
      "Floor Finish",
      fullDescription,
      "m²",
      area,
      billKey,
      section,
      pcSum
    )
  );

  return outputs;
}

/**
 * Tiles component (for wall tiles)
 * Goes to TILING bill
 */
export function createTileOutputs(
  context: OutputContext,
  description: string,
  pcSum: number,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const fullDescription = `${description} PC R${pcSum}/m²`;

  outputs.push(
    createCostPlanOutput(
      context,
      "Tiles",
      fullDescription,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId,
      pcSum
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Tiles",
      fullDescription,
      "m²",
      area,
      "TILING",
      SECTIONS.TILING,
      pcSum
    )
  );

  return outputs;
}

/**
 * Paint component
 * Goes to PAINTWORK bill
 */
export function createPaintOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Paint",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Paint",
      description,
      "m²",
      area,
      "PAINTWORK",
      SECTIONS.PAINT
    )
  );

  return outputs;
}

/**
 * Plaster component
 * Goes to PLASTERING bill
 */
export function createPlasterOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Plaster",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Plaster",
      description,
      "m²",
      area,
      "PLASTERING",
      SECTIONS.PLASTER
    )
  );

  return outputs;
}

/**
 * DPC component
 * Goes to MASONRY bill
 */
export function createDpcOutputs(
  context: OutputContext,
  description: string,
  length: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "DPC",
      description,
      "m",
      length,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "DPC",
      description,
      "m",
      length,
      "MASONRY",
      SECTIONS.DAMP_PROOF_COURSES
    )
  );

  return outputs;
}

/**
 * Brickwork component
 * Goes to MASONRY bill
 */
export function createBrickworkOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Brickwork",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Brickwork",
      description,
      "m²",
      area,
      "MASONRY",
      SECTIONS.BRICKWORK
    )
  );

  return outputs;
}

// ============================================================
// NEW HELPER FUNCTIONS FOR ADDITIONAL MODULES
// ============================================================

/**
 * Excavation component
 * Goes to EARTHWORKS bill
 */
export function createExcavationOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Excavation",
      description,
      "m³",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Excavation",
      description,
      "m³",
      qty,
      "EARTHWORKS",
      SECTIONS.EXCAVATION
    )
  );

  return outputs;
}

/**
 * Backfill component
 * Goes to EARTHWORKS bill
 */
export function createBackfillOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Backfill",
      description,
      "m³",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Backfill",
      description,
      "m³",
      qty,
      "EARTHWORKS",
      SECTIONS.BACKFILLING
    )
  );

  return outputs;
}

/**
 * Blinding component
 * Goes to EARTHWORKS bill
 */
export function createBlindingOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Blinding",
      description,
      "m³",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Blinding",
      description,
      "m³",
      qty,
      "EARTHWORKS",
      SECTIONS.BLINDING
    )
  );

  return outputs;
}

/**
 * Soil Poison component
 * Goes to EARTHWORKS bill
 */
export function createSoilPoisonOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Soil Poison",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Soil Poison",
      description,
      "m²",
      area,
      "EARTHWORKS",
      SECTIONS.SOIL_POISONING
    )
  );

  return outputs;
}

/**
 * DPM component
 * Goes to WATERPROOFING bill
 */
export function createDpmOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "DPM",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "DPM",
      description,
      "m²",
      area,
      "WATERPROOFING",
      SECTIONS.DPM
    )
  );

  return outputs;
}

/**
 * Powerfloat component
 * Goes to FLOOR_COVERINGS bill
 */
export function createPowerfloatOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Powerfloat",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Powerfloat",
      description,
      "m²",
      area,
      "FLOOR_COVERINGS",
      SECTIONS.FLOOR_FINISHES
    )
  );

  return outputs;
}

/**
 * Layer component (for surface beds)
 * Goes to EARTHWORKS bill
 */
export function createLayerOutputs(
  context: OutputContext,
  material: string,
  thickness: number,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const description = `${thickness}mm ${material} layer`;

  outputs.push(
    createCostPlanOutput(
      context,
      "Layer",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Layer",
      description,
      "m²",
      area,
      "EARTHWORKS",
      "Layers"
    )
  );

  return outputs;
}

/**
 * Lintel component
 * Goes to MASONRY bill
 */
export function createLintelOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Lintel",
      description,
      "m",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Lintel",
      description,
      "m",
      qty,
      "MASONRY",
      SECTIONS.LINTELS
    )
  );

  return outputs;
}

/**
 * Reveal Plaster component
 * Goes to PLASTERING bill (Narrow Widths)
 */
export function createRevealPlasterOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Reveal Plaster",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Reveal Plaster",
      description,
      "m²",
      area,
      "PLASTERING",
      SECTIONS.NARROW_WIDTHS
    )
  );

  return outputs;
}

/**
 * Door component
 * Goes to CARPENTRY or METALWORK bill
 */
export function createDoorOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  billKey: string = "CARPENTRY",
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Door",
      description,
      "No",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Door",
      description,
      "No",
      qty,
      billKey,
      SECTIONS.DOORS
    )
  );

  return outputs;
}

/**
 * Window component
 * Goes to METALWORK or CARPENTRY bill
 */
export function createWindowOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  billKey: string = "METALWORK",
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Window",
      description,
      "No",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Window",
      description,
      "No",
      qty,
      billKey,
      SECTIONS.WINDOWS
    )
  );

  return outputs;
}

/**
 * Frame component (for doors/windows)
 * Goes to CARPENTRY or METALWORK bill
 */
export function createFrameOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  billKey: string = "CARPENTRY",
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Frame",
      description,
      "m",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Frame",
      description,
      "m",
      qty,
      billKey,
      SECTIONS.FRAMES
    )
  );

  return outputs;
}

/**
 * Sill component (for windows)
 * Goes to MASONRY or CARPENTRY bill
 */
export function createSillOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  billKey: string = "MASONRY",
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Sill",
      description,
      "m",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Sill",
      description,
      "m",
      qty,
      billKey,
      SECTIONS.SILLS
    )
  );

  return outputs;
}

/**
 * Ironmongery component
 * Goes to IRONMONGERY bill
 */
export function createIronmongeryOutputs(
  context: OutputContext,
  description: string,
  qty: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Ironmongery",
      description,
      "No",
      qty,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Ironmongery",
      description,
      "No",
      qty,
      "IRONMONGERY",
      SECTIONS.IRONMONGERY
    )
  );

  return outputs;
}

/**
 * Working Space component
 * Goes to EARTHWORKS bill
 */
export function createWorkingSpaceOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Working Space",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Working Space",
      description,
      "m²",
      area,
      "EARTHWORKS",
      "Working Space"
    )
  );

  return outputs;
}

/**
 * Risk of Collapse component
 * Goes to EARTHWORKS bill
 */
export function createRiskOfCollapseOutputs(
  context: OutputContext,
  description: string,
  area: number,
  sectionId?: string,
  elementId?: string
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];

  outputs.push(
    createCostPlanOutput(
      context,
      "Risk of Collapse",
      description,
      "m²",
      area,
      sectionId || context.sectionId,
      elementId || context.elementId
    )
  );
  outputs.push(
    createBoqOutput(
      context,
      "Risk of Collapse",
      description,
      "m²",
      area,
      "EARTHWORKS",
      "Risk of Collapse"
    )
  );

  return outputs;
}

/**
 * Reset ID counter (useful for testing)
 */
export function resetOutputCounter(): void {
  idCounter = 0;
}