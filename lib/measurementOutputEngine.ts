import {
  MeasurementOutput,
  WallType,
  WallMeasurement,
  CostPlanComponent,
  OutputContext,
  BoqItem,
  SlabType,
  SlabMeasurement,
} from "@/types/boq";
import { getCostPlanMapping } from "./wallCostPlanMapping";
import { addBoqItemFromBillKey } from "./boqHelpers";
import { SECTIONS } from "./boqStructure";
import {
  createCostPlanOutput,
  createBoqOutput,
  createConcreteOutputs,
  createRebarOutputs,
  createMeshOutputs,
  createFormworkOutputs,
  createScreedOutputs,
  createFloorFinishOutputs,
  createTileOutputs,
  createPaintOutputs,
  createPlasterOutputs,
  createDpcOutputs,
  createBrickworkOutputs,
} from "./outputHelpers";

// ============================================================
// GENERIC OUTPUT GENERATOR
// ============================================================

export function generateMeasurementOutputs(
  module: string,
  measurement: any,
  typeDefinition: any,
  context: Partial<OutputContext> = {}
): MeasurementOutput[] {
  switch (module) {
    case "Walls":
      return generateWallMeasurementOutputs(
        measurement as WallMeasurement,
        typeDefinition as WallType,
        {
          module: "Walls",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "internal-divisions",
          elementId: context.elementId || "walls",
        }
      );
    case "Slabs":
      return generateSlabMeasurementOutputs(
        measurement as SlabMeasurement,
        typeDefinition as SlabType,
        {
          module: "Slabs",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "structural-frame",
          elementId: context.elementId || "slabs",
        }
      );
    default:
      return [];
  }
}

// ============================================================
// WALL MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateWallMeasurementOutputs(
  measurement: WallMeasurement,
  wallType: WallType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const area = measurement.area;
  const length = measurement.length;
  const mapping = getCostPlanMapping(measurement.wallLocation || "Internal Division");

  // Helper to create a cost-plan output
  const createCostPlanOutputLocal = (
    componentName: string,
    description: string,
    unit: string,
    qty: number,
    sectionId?: string,
    elementId?: string,
    rate?: number
  ): MeasurementOutput => {
    return createCostPlanOutput(
      { ...context, sectionId: sectionId || context.sectionId, elementId: elementId || context.elementId },
      componentName,
      description,
      unit,
      qty,
      sectionId,
      elementId,
      rate
    );
  };

  // Helper to create a BOQ output
  const createBoqOutputLocal = (
    componentName: string,
    description: string,
    unit: string,
    qty: number,
    billKey: string,
    section: string,
    rate?: number
  ): MeasurementOutput => {
    return createBoqOutput(
      context,
      componentName,
      description,
      unit,
      qty,
      billKey,
      section,
      rate
    );
  };

  // ============================================================
  // 1. STRUCTURE (Brickwork)
  // ============================================================
  outputs.push(
  ...createBrickworkOutputs(
    context,
    `${wallType.brickType} brickwork - ${wallType.thicknessType}`,
    area,
    mapping.structure.sectionId,
    mapping.structure.elementId
  )
);

// 2. Plaster
if (wallType.side1Plaster) {
  outputs.push(
    ...createPlasterOutputs(
      context,
      `Plaster to walls (Side 1) - ${wallType.thicknessType}`,
      area,
      mapping.side1Finish.sectionId,
      mapping.side1Finish.elementId
    )
  );
}

// 3. Paint
if (wallType.side1Finish === "Paint") {
  outputs.push(
    ...createPaintOutputs(
      context,
      `Paint to walls (Side 1) - ${wallType.thicknessType}`,
      area,
      mapping.side1Finish.sectionId,
      mapping.side1Finish.elementId
    )
  );
}

// 4. Tiles
if (wallType.side1Finish === "Tile") {
  const rate = wallType.side1TilePcSum || 0;
  outputs.push(
    ...createTileOutputs(
      context,
      `Wall tiles (Side 1)`,
      rate,
      area,
      mapping.side1Finish.sectionId,
      mapping.side1Finish.elementId
    )
  );
}

// 5. DPC
if (wallType.dpcRequired) {
  outputs.push(
    ...createDpcOutputs(
      context,
      `DPC to walls`,
      length,
      mapping.structure.sectionId,
      mapping.structure.elementId
    )
  );
  }

  // ============================================================
  // 5. REINFORCEMENT
  // ============================================================
  if (wallType.reinforcementRequired) {
    let wallThicknessMm = 0;
    if (wallType.thicknessType === "Single Skin (Half Brick)") wallThicknessMm = 102;
    else if (wallType.thicknessType === "Double Skin (One Brick)") wallThicknessMm = 215;
    else if (wallType.thicknessType === "Cavity Wall") wallThicknessMm = 275;
    else if (wallType.thicknessType === "Triple Skin") wallThicknessMm = 327;
    else if (wallType.thicknessMm) wallThicknessMm = wallType.thicknessMm;

    const layers = Math.floor(
      (measurement.height * 1000) /
      (wallType.courseHeight * wallType.coursesPerReinforcement)
    );
    const totalLength = measurement.length * layers;

    if (totalLength > 0) {
      const widthLabel = wallThicknessMm > 102 ? "150mm" : "75mm";
      const description = `${widthLabel} ${wallType.reinforcementType} bed joint reinforcement`;
      
      outputs.push(
        createCostPlanOutputLocal(
          "Reinforcement",
          description,
          "m",
          totalLength,
          mapping.structure.sectionId,
          mapping.structure.elementId
        )
      );
      outputs.push(
        createBoqOutputLocal(
          "Reinforcement",
          description,
          "m",
          totalLength,
          "MASONRY",
          SECTIONS.MASONRY_REINFORCEMENT
        )
      );
    }
  }

  return outputs;
}

// ============================================================
// SLAB MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateSlabMeasurementOutputs(
  measurement: SlabMeasurement,
  slabType: SlabType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  const area = measurement.area;
  const concreteVol = area * (slabType.thickness / 1000);
  const strength = slabType.concreteClass.split('/')[0];

  // ============================================================
  // 1. CONCRETE
  // ============================================================
  outputs.push(
    ...createConcreteOutputs(
      context,
      slabType.concreteClass,
      `concrete in suspended slab`,
      concreteVol,
      strength,
      context.sectionId,
      context.elementId
    )
  );

  // ============================================================
  // 2. REINFORCEMENT
  // ============================================================
  if (slabType.reinfType === "Rebar" && slabType.reinfKgPerM3) {
    outputs.push(
      ...createRebarOutputs(
        context,
        concreteVol,
        slabType.reinfKgPerM3,
        context.sectionId,
        context.elementId
      )
    );
  } else if (slabType.reinfType === "Mesh" && slabType.meshType && slabType.meshType !== "None") {
    outputs.push(
      ...createMeshOutputs(
        context,
        slabType.meshType,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }

  // ============================================================
  // 3. FORMWORK TO EDGES
  // ============================================================
  if (slabType.formworkToEdges) {
    const perimeter = 2 * (measurement.length + measurement.width) * measurement.quantity;
    const formwork = perimeter * (slabType.thickness / 1000);
    outputs.push(
      ...createFormworkOutputs(
        context,
        "Formwork to edges of slabs",
        formwork,
        context.sectionId,
        context.elementId
      )
    );
  }

  // ============================================================
  // 4. SCREED
  // ============================================================
  if (slabType.screedRequired && slabType.screedThickness) {
    outputs.push(
      ...createScreedOutputs(
        context,
        slabType.screedThickness,
        "Normal", // Default screed type
        area,
        context.sectionId,
        context.elementId
      )
    );
  }

  // ============================================================
  // 5. FLOOR FINISH
  // ============================================================
  if (slabType.floorFinishPcSum > 0) {
    outputs.push(
      ...createFloorFinishOutputs(
        context,
        slabType.floorFinishDescription || "Tiles",
        slabType.floorFinishPcSum,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }

  return outputs;
}

// ============================================================
// BACKWARD COMPATIBILITY: Convert to CostPlanComponent[]
// ============================================================

export function measurementOutputsToCostPlanComponents(
  outputs: MeasurementOutput[]
): CostPlanComponent[] {
  return outputs
    .filter((o) => o.outputType === "cost-plan")
    .map((o) => ({
      id: o.id,
      measurementId: o.sourceMeasurementId,
      mark: o.sourceMark,
      module: o.sourceModule,
      elementalSectionId: o.sectionId || "",
      elementalElementId: o.elementId || "",
      description: o.description,
      unit: o.unit,
      qty: o.qty,
      rate: o.rate,
      amount: o.amount,
    }));
}

// ============================================================
// WALL WRAPPER FUNCTIONS
// ============================================================

export function generateWallCostPlanComponents(
  wallMeasurements: WallMeasurement[],
  wallTypes: WallType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  wallMeasurements.forEach((measurement) => {
    const wallType = wallTypes.find((w) => w.id === measurement.wallTypeId);
    if (!wallType) return;

    const outputs = generateWallMeasurementOutputs(measurement, wallType, {
      module: "Walls",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "internal-divisions",
      elementId: "walls",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateWallBoqItems(
  wallMeasurements: WallMeasurement[],
  wallTypes: WallType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  wallMeasurements.forEach((measurement) => {
    const wallType = wallTypes.find((w) => w.id === measurement.wallTypeId);
    if (!wallType) return;

    const outputs = generateWallMeasurementOutputs(measurement, wallType, {
      module: "Walls",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "internal-divisions",
      elementId: "walls",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// ============================================================
// SLAB WRAPPER FUNCTIONS
// ============================================================

export function generateSlabCostPlanComponents(
  slabMeasurements: SlabMeasurement[],
  slabTypes: SlabType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  slabMeasurements.forEach((measurement) => {
    const slabType = slabTypes.find((s) => s.id === measurement.slabTypeId);
    if (!slabType) return;

    const outputs = generateSlabMeasurementOutputs(measurement, slabType, {
      module: "Slabs",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "structural-frame",
      elementId: "slabs",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateSlabBoqItems(
  slabMeasurements: SlabMeasurement[],
  slabTypes: SlabType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  slabMeasurements.forEach((measurement) => {
    const slabType = slabTypes.find((s) => s.id === measurement.slabTypeId);
    if (!slabType) return;

    const outputs = generateSlabMeasurementOutputs(measurement, slabType, {
      module: "Slabs",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "structural-frame",
      elementId: "slabs",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// ============================================================
// GENERIC BOQ GENERATOR
// ============================================================

export function generateBoqItemsFromOutputs(
  outputs: MeasurementOutput[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const boqOutputs = outputs.filter((o) => o.outputType === "boq");

  boqOutputs.forEach((output) => {
    const billKey = output.sectionId || "GENERAL";
    const section = output.elementId || "General";
    
    addBoqItemFromBillKey(
      boqItems,
      billKey,
      section,
      output.description,
      output.unit,
      output.qty,
      {
        module: output.sourceModule,
        measurementId: output.sourceMeasurementId,
        mark: output.sourceMark,
        qty: output.qty,
      }
    );
  });

  return boqItems;
}