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
  const strengthLabel = strength || concreteClass.split('/')[0];

  // Cost Plan
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

  // BOQ
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
    // Cost Plan
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
    // BOQ
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
    // Cost Plan
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
    // BOQ
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

  // Cost Plan
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

  // BOQ
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

  // Cost Plan
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

  // BOQ
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
 * FIXED: Goes to PLASTERING bill
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

  // Cost Plan
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

  // BOQ - FIXED: Goes to PLASTERING bill
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
 * FIXED: Goes to TILING bill
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

  // Cost Plan
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

  // BOQ - FIXED: Goes to TILING bill (or appropriate bill)
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

  // Cost Plan
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

  // BOQ - Goes to TILING bill
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

  // Cost Plan
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

  // BOQ - Goes to PAINTWORK bill
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

  // Cost Plan
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

  // BOQ - Goes to PLASTERING bill
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

  // Cost Plan
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

  // BOQ - Goes to MASONRY bill
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

  // Cost Plan
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

  // BOQ - Goes to MASONRY bill
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

/**
 * Reset ID counter (useful for testing)
 */
export function resetOutputCounter(): void {
  idCounter = 0;
}