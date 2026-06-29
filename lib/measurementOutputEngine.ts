import {
  MeasurementOutput,
  WallType,
  WallMeasurement,
  CostPlanComponent,
  OutputContext,
  BoqItem,
  SlabType,
  SlabMeasurement,
  BeamType,
  BeamMeasurement,
  ColumnType,
  ColumnMeasurement,
  SurfaceBedType,
  SurfaceBedMeasurement,
  GroundBeamType,
  GroundBeamMeasurement,
  PadFootingType,
  PadFootingMeasurement,
  OpeningType,
  OpeningMeasurement,
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
  createExcavationOutputs,
  createBackfillOutputs,
  createBlindingOutputs,
  createSoilPoisonOutputs,
  createDpmOutputs,
  createPowerfloatOutputs,
  createLayerOutputs,
  createLintelOutputs,
  createRevealPlasterOutputs,
  createDoorOutputs,
  createWindowOutputs,
  createFrameOutputs,
  createSillOutputs,
  createIronmongeryOutputs,
  createWorkingSpaceOutputs,
  createRiskOfCollapseOutputs,
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
    case "Beams":
      return generateBeamMeasurementOutputs(
        measurement as BeamMeasurement,
        typeDefinition as BeamType,
        {
          module: "Beams",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "structural-frame",
          elementId: context.elementId || "beams",
        }
      );
    case "Columns":
      return generateColumnMeasurementOutputs(
        measurement as ColumnMeasurement,
        typeDefinition as ColumnType,
        {
          module: "Columns",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "structural-frame",
          elementId: context.elementId || "columns",
        }
      );
    case "SurfaceBeds":
      return generateSurfaceBedMeasurementOutputs(
        measurement as SurfaceBedMeasurement,
        typeDefinition as SurfaceBedType,
        {
          module: "SurfaceBeds",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "ground-floor",
          elementId: context.elementId || "solid-floors",
        }
      );
    case "GroundBeams":
      return generateGroundBeamMeasurementOutputs(
        measurement as GroundBeamMeasurement,
        typeDefinition as GroundBeamType,
        {
          module: "GroundBeams",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "substructure",
          elementId: context.elementId || "ground-beams",
        }
      );
    case "PadFootings":
      return generatePadFootingMeasurementOutputs(
        measurement as PadFootingMeasurement,
        typeDefinition as PadFootingType,
        {
          module: "PadFootings",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "substructure",
          elementId: context.elementId || "pad-footings",
        }
      );
    case "Openings":
      return generateOpeningMeasurementOutputs(
        measurement as OpeningMeasurement,
        typeDefinition as OpeningType,
        {
          module: "Openings",
          measurementId: measurement.id,
          mark: measurement.mark,
          sectionId: context.sectionId || "internal-divisions",
          elementId: context.elementId || "openings",
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

  // ============================================================
  // 2. SIDE 1 FINISHES
  // ============================================================
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

  if (wallType.side1Finish === "Tile") {
    const rate = wallType.side1TilePcSum || 0;
    outputs.push(
      ...createTileOutputs(
        context,
        `Wall tiles (Side 1) PC R${rate}/m²`,
        rate,
        area,
        mapping.side1Finish.sectionId,
        mapping.side1Finish.elementId
      )
    );
  }

  // ============================================================
  // 3. SIDE 2 FINISHES
  // ============================================================
  if (wallType.side2Plaster) {
    outputs.push(
      ...createPlasterOutputs(
        context,
        `Plaster to walls (Side 2) - ${wallType.thicknessType}`,
        area,
        mapping.side2Finish.sectionId,
        mapping.side2Finish.elementId
      )
    );
  }

  if (wallType.side2Finish === "Paint") {
    outputs.push(
      ...createPaintOutputs(
        context,
        `Paint to walls (Side 2) - ${wallType.thicknessType}`,
        area,
        mapping.side2Finish.sectionId,
        mapping.side2Finish.elementId
      )
    );
  }

  if (wallType.side2Finish === "Tile") {
    const rate = wallType.side2TilePcSum || 0;
    outputs.push(
      ...createTileOutputs(
        context,
        `Wall tiles (Side 2) PC R${rate}/m²`,
        rate,
        area,
        mapping.side2Finish.sectionId,
        mapping.side2Finish.elementId
      )
    );
  }

  // ============================================================
  // 4. DPC
  // ============================================================
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
  
  const area = measurement.area || 0;
  const thickness = slabType.thickness || 0;
  const concreteVol = area * (thickness / 1000);
  
  if (isNaN(concreteVol) || concreteVol === 0) {
    console.warn("Slab measurement has invalid data:", { measurement, slabType });
    return outputs;
  }
  
  const strength = slabType.concreteClass?.split('/')[0] || "Unknown";

  // 1. CONCRETE
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

  // 2. REINFORCEMENT
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

  // 3. FORMWORK TO EDGES
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

  // 4. SCREED
  if (slabType.screedRequired && slabType.screedThickness) {
    outputs.push(
      ...createScreedOutputs(
        context,
        slabType.screedThickness,
        "Normal",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }

  // 5. FLOOR FINISH
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
// BEAM MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateBeamMeasurementOutputs(
  measurement: BeamMeasurement,
  beamType: BeamType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  
  const beamWidth = beamType.beamWidthMm || beamType.width || 230;
  const downstandDepth = beamType.downstandDepthMm || beamType.depth || 400;
  const upstandHeight = beamType.upstandHeightMm || 0;
  const slabThickness = beamType.slabThicknessMm || 0;
  const length = measurement.length || 0;
  
  let concreteVol = 0;
  const profileType = beamType.beamProfileType || "Downstand Beam";
  
  if (profileType === "Combined Downstand / Inverted Beam") {
    const overallDepth = downstandDepth + slabThickness + upstandHeight;
    concreteVol = (beamWidth / 1000) * (overallDepth / 1000) * length;
  } else {
    concreteVol = (beamWidth / 1000) * (downstandDepth / 1000) * length;
  }
  
  if (concreteVol === 0) {
    console.warn("Beam measurement has zero concrete volume:", measurement);
    return outputs;
  }
  
  const strength = beamType.concreteClass.split('/')[0];
  
  // 1. CONCRETE
  let concreteDesc = `${beamType.concreteClass} concrete in beams`;
  if (profileType === "Combined Downstand / Inverted Beam") {
    concreteDesc = `${beamType.concreteClass} concrete in combined downstand / inverted beams`;
  }
  outputs.push(
    ...createConcreteOutputs(
      context,
      beamType.concreteClass,
      concreteDesc,
      concreteVol,
      strength,
      context.sectionId,
      context.elementId
    )
  );
  
  // 2. REINFORCEMENT
  if (beamType.reinfKg) {
    outputs.push(
      ...createRebarOutputs(
        context,
        concreteVol,
        beamType.reinfKg,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 3. FORMWORK
  if (profileType === "Integrated Beam / No Separate Beam Formwork") {
    return outputs;
  }
  
  const finish = beamType.formworkFinish || "Smooth";
  let proppingHeightDesc = "";
  if (beamType.proppingHeightBand === "Custom") {
    proppingHeightDesc = beamType.customProppingHeightDescription || "custom height";
  } else {
    proppingHeightDesc = beamType.proppingHeightBand || "Not exceeding 1.5m";
  }
  
  // Combined beam formwork
  if (profileType === "Combined Downstand / Inverted Beam") {
    const overallDepth = downstandDepth + slabThickness + upstandHeight;
    const outerGirth = overallDepth + beamWidth + downstandDepth;
    const outerArea = (outerGirth / 1000) * length;
    if (outerArea > 0) {
      const desc = `${finish} formwork to sides and soffits of combined downstand / inverted beams, propped up ${proppingHeightDesc} high`;
      outputs.push(
        ...createFormworkOutputs(
          context,
          desc,
          outerArea,
          context.sectionId,
          context.elementId
        )
      );
    }
    if (upstandHeight > 0) {
      if (upstandHeight <= 300) {
        const desc = `${finish} formwork to edges, risers, ends and reveals of inverted beams, propped up ${proppingHeightDesc} high`;
        outputs.push(
          ...createFormworkOutputs(
            context,
            desc,
            length,
            context.sectionId,
            context.elementId
          )
        );
      } else {
        const invArea = (upstandHeight / 1000) * length;
        const desc = `${finish} formwork to sides of inverted beams, propped up ${proppingHeightDesc} high`;
        outputs.push(
          ...createFormworkOutputs(
            context,
            desc,
            invArea,
            context.sectionId,
            context.elementId
          )
        );
      }
    }
    return outputs;
  }
  
  // Standard profiles
  let girth = 0;
  let desc = "";
  switch (profileType) {
    case "Downstand Beam":
      girth = 2 * downstandDepth + beamWidth;
      desc = `${finish} formwork to sides and soffits of downstand beams, propped up ${proppingHeightDesc} high`;
      break;
    case "Upstand Beam":
      girth = 2 * upstandHeight;
      desc = `${finish} formwork to sides of upstand beams, propped up ${proppingHeightDesc} high`;
      break;
    case "Perimeter Beam (Downstand Only)":
      girth = 2 * downstandDepth + beamWidth;
      desc = `${finish} formwork to sides and soffits of perimeter beams, propped up ${proppingHeightDesc} high`;
      break;
    case "Perimeter Beam (Downstand + Upstand)":
      girth = 2 * downstandDepth + beamWidth + upstandHeight;
      desc = `${finish} formwork to sides and soffits of perimeter beams with upstand, propped up ${proppingHeightDesc} high`;
      break;
    default:
      girth = 2 * downstandDepth + beamWidth;
      desc = `${finish} formwork to beams, propped up ${proppingHeightDesc} high`;
  }
  const formworkArea = (girth / 1000) * length;
  if (formworkArea > 0) {
    outputs.push(
      ...createFormworkOutputs(
        context,
        desc,
        formworkArea,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  return outputs;
}

// ============================================================
// COLUMN MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateColumnMeasurementOutputs(
  measurement: ColumnMeasurement,
  columnType: ColumnType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  
  const width = columnType.width || 0;
  const depth = columnType.depth || 0;
  const height = columnType.height || 0;
  const qty = measurement.quantity || 0;
  
  const concreteVol = (width / 1000) * (depth / 1000) * (height / 1000) * qty;
  
  if (concreteVol === 0) {
    console.warn("Column measurement has zero concrete volume:", measurement);
    return outputs;
  }
  
  const strength = columnType.concreteClass.split('/')[0];
  
  // 1. CONCRETE
  outputs.push(
    ...createConcreteOutputs(
      context,
      columnType.concreteClass,
      `concrete in columns`,
      concreteVol,
      strength,
      context.sectionId,
      context.elementId
    )
  );
  
  // 2. REINFORCEMENT
  if (columnType.reinfKgPerM3) {
    outputs.push(
      ...createRebarOutputs(
        context,
        concreteVol,
        columnType.reinfKgPerM3,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 3. FORMWORK
  if (columnType.formworkRequired) {
    const perimeter = 2 * ((width / 1000) + (depth / 1000));
    const formwork = perimeter * (height / 1000) * qty;
    const desc = `${columnType.formworkFinish || "Smooth"} formwork to sides of columns`;
    outputs.push(
      ...createFormworkOutputs(
        context,
        desc,
        formwork,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  return outputs;
}

// ============================================================
// SURFACE BED MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateSurfaceBedMeasurementOutputs(
  measurement: SurfaceBedMeasurement,
  surfaceBedType: SurfaceBedType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  
  const area = measurement.area || 0;
  
  if (area === 0) {
    console.warn("Surface bed measurement has zero area:", measurement);
    return outputs;
  }
  
  // 1. LAYERS
  if (surfaceBedType.layer1Material && surfaceBedType.layer1Thickness > 0) {
    outputs.push(
      ...createLayerOutputs(
        context,
        surfaceBedType.layer1Material,
        surfaceBedType.layer1Thickness,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  if (surfaceBedType.layer2Material && surfaceBedType.layer2Thickness > 0) {
    outputs.push(
      ...createLayerOutputs(
        context,
        surfaceBedType.layer2Material,
        surfaceBedType.layer2Thickness,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  if (surfaceBedType.layer3Material && surfaceBedType.layer3Thickness > 0) {
    outputs.push(
      ...createLayerOutputs(
        context,
        surfaceBedType.layer3Material,
        surfaceBedType.layer3Thickness,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 2. DPM
  if (surfaceBedType.dpm) {
    outputs.push(
      ...createDpmOutputs(
        context,
        "DPM under surface beds",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 3. SOIL POISON
  if (surfaceBedType.soilPoison) {
    outputs.push(
      ...createSoilPoisonOutputs(
        context,
        "Soil poisoning under surface beds",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 4. MESH
  if (surfaceBedType.meshType !== "None") {
    outputs.push(
      ...createMeshOutputs(
        context,
        surfaceBedType.meshType,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 5. CONCRETE
  const concreteVol = area * (surfaceBedType.thickness / 1000);
  const strength = surfaceBedType.concreteClass.split('/')[0];
  outputs.push(
    ...createConcreteOutputs(
      context,
      surfaceBedType.concreteClass,
      `concrete in surface beds`,
      concreteVol,
      strength,
      context.sectionId,
      context.elementId
    )
  );
  
  // 6. SCREED
  if (surfaceBedType.screedRequired && surfaceBedType.screedThickness) {
    outputs.push(
      ...createScreedOutputs(
        context,
        surfaceBedType.screedThickness,
        surfaceBedType.screedType || "Normal",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 7. TILES
  if (surfaceBedType.tileRequired && surfaceBedType.tilePcSum > 0) {
    outputs.push(
      ...createTileOutputs(
        context,
        `Floor tiles PC R${surfaceBedType.tilePcSum}/m²`,
        surfaceBedType.tilePcSum,
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 8. POWERFLOAT
  if (surfaceBedType.powerfloat) {
    outputs.push(
      ...createPowerfloatOutputs(
        context,
        "Powerfloat finish to surface beds",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  return outputs;
}

// ============================================================
// GROUND BEAM MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateGroundBeamMeasurementOutputs(
  measurement: GroundBeamMeasurement,
  groundBeamType: GroundBeamType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  
  const length = measurement.length || 0;
  const trenchVol = (groundBeamType.trenchWidth / 1000) * (groundBeamType.trenchDepth / 1000) * length;
  const concreteVol = (groundBeamType.beamWidth / 1000) * (groundBeamType.beamDepth / 1000) * length;
  
  if (concreteVol === 0) {
    console.warn("Ground beam measurement has zero concrete volume:", measurement);
    return outputs;
  }
  
  const strength = groundBeamType.concreteClass.split('/')[0];
  const depthM = groundBeamType.trenchDepth / 1000;
  
  // 1. EXCAVATION
  outputs.push(
    ...createExcavationOutputs(
      context,
      "Excavation for ground beams",
      trenchVol,
      context.sectionId,
      context.elementId
    )
  );
  
  // 2. CONCRETE
  outputs.push(
    ...createConcreteOutputs(
      context,
      groundBeamType.concreteClass,
      `concrete in ground beams`,
      concreteVol,
      strength,
      context.sectionId,
      context.elementId
    )
  );
  
  // 3. REINFORCEMENT
  if (groundBeamType.reinfKgPerM3) {
    outputs.push(
      ...createRebarOutputs(
        context,
        concreteVol,
        groundBeamType.reinfKgPerM3,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 4. FORMWORK
  if (groundBeamType.formworkRequired) {
    const formwork = (groundBeamType.beamDepth / 1000) * length * 2;
    outputs.push(
      ...createFormworkOutputs(
        context,
        "Formwork to sides of ground beams",
        formwork,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 5. BLINDING
  if (groundBeamType.blindingRequired && groundBeamType.blindingThickness) {
    const blinding = (groundBeamType.beamWidth / 1000) * (groundBeamType.blindingThickness / 1000) * length;
    outputs.push(
      ...createBlindingOutputs(
        context,
        `${groundBeamType.blindingThickness}mm blinding under ground beams`,
        blinding,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 6. BACKFILL
  if (groundBeamType.backfillRequired) {
    const backfill = trenchVol - concreteVol;
    outputs.push(
      ...createBackfillOutputs(
        context,
        "Backfill to ground beams",
        backfill,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 7. DPC
  if (groundBeamType.dpcRequired) {
    const dpcArea = (groundBeamType.beamWidth / 1000) * length;
    outputs.push(
      ...createDpcOutputs(
        context,
        "DPC to ground beams",
        dpcArea,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 8. SOIL POISON
  if (groundBeamType.soilPoisonRequired) {
    const area = (groundBeamType.trenchWidth / 1000) * length;
    outputs.push(
      ...createSoilPoisonOutputs(
        context,
        "Soil poisoning under ground beams",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 9. WORKING SPACE
  if (groundBeamType.formworkRequired && groundBeamType.workingSpaceRequired) {
    const trenchWidthM = groundBeamType.trenchWidth / 1000;
    const perimeter = 2 * (trenchWidthM + depthM);
    let workingSpaceArea = 0;
    let depthBandDesc = "";
    
    if (depthM > 0.5 && depthM <= 1.5) {
      workingSpaceArea = perimeter * length;
      depthBandDesc = "Exceeding 0.5m and not exceeding 1.5m deep";
    } else if (depthM > 1.5 && depthM <= 3.0) {
      workingSpaceArea = perimeter * length;
      depthBandDesc = "Exceeding 1.5m and not exceeding 3.0m deep";
    } else if (depthM > 3.0 && depthM <= 4.5) {
      workingSpaceArea = perimeter * length;
      depthBandDesc = "Exceeding 3.0m and not exceeding 4.5m deep";
    } else if (depthM > 4.5 && depthM <= 6.0) {
      workingSpaceArea = perimeter * length;
      depthBandDesc = "Exceeding 4.5m and not exceeding 6.0m deep";
    } else if (depthM > 6.0) {
      workingSpaceArea = perimeter * length;
      depthBandDesc = "Exceeding 6.0m deep";
    }
    
    if (workingSpaceArea > 0) {
      const desc = `Back excavation of vertical sides of excavations in earth for working space including backfilling compacted to 95% Mod AASHTO density: ${depthBandDesc}`;
      outputs.push(
        ...createWorkingSpaceOutputs(
          context,
          desc,
          workingSpaceArea,
          context.sectionId,
          context.elementId
        )
      );
    }
  }
  
  // 10. RISK OF COLLAPSE
  if (groundBeamType.riskOfCollapseRequired) {
    const trenchWidthM = groundBeamType.trenchWidth / 1000;
    const perimeter = 2 * (trenchWidthM + depthM);
    const collapseArea = perimeter * length;
    let bandDesc = depthM <= 1.5 ? "not exceeding 1.5m deep" : "exceeding 1.5m deep";
    const desc = `Sides of trench and hole excavations ${bandDesc}`;
    outputs.push(
      ...createRiskOfCollapseOutputs(
        context,
        desc,
        collapseArea,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  return outputs;
}

// ============================================================
// PAD FOOTING MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generatePadFootingMeasurementOutputs(
  measurement: PadFootingMeasurement,
  padFootingType: PadFootingType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  
  const qty = measurement.quantity || 0;
  const padConcrete = (padFootingType.padLength / 1000) * (padFootingType.padWidth / 1000) * (padFootingType.padDepth / 1000) * qty;
  const excavationVol = (padFootingType.excavationLength / 1000) * (padFootingType.excavationWidth / 1000) * (padFootingType.excavationDepth / 1000) * qty;
  
  if (padConcrete === 0) {
    console.warn("Pad footing measurement has zero concrete volume:", measurement);
    return outputs;
  }
  
  const strength = padFootingType.concreteClass.split('/')[0];
  
  // 1. EXCAVATION
  outputs.push(
    ...createExcavationOutputs(
      context,
      "Excavation for pad footings",
      excavationVol,
      context.sectionId,
      context.elementId
    )
  );
  
  // 2. CONCRETE
  outputs.push(
    ...createConcreteOutputs(
      context,
      padFootingType.concreteClass,
      `concrete in pad footings`,
      padConcrete,
      strength,
      context.sectionId,
      context.elementId
    )
  );
  
  // 3. REINFORCEMENT
  if (padFootingType.reinfKg) {
    outputs.push(
      ...createRebarOutputs(
        context,
        padConcrete,
        padFootingType.reinfKg,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 4. FORMWORK
  if (padFootingType.formworkRequired) {
    const formwork = 2 * ((padFootingType.padLength / 1000) + (padFootingType.padWidth / 1000)) * (padFootingType.padDepth / 1000) * qty;
    outputs.push(
      ...createFormworkOutputs(
        context,
        "Formwork to sides of pad footings",
        formwork,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 5. BLINDING
  if (padFootingType.blindingRequired) {
    const blinding = (padFootingType.excavationLength / 1000) * (padFootingType.excavationWidth / 1000) * (padFootingType.blindingThickness / 1000) * qty;
    outputs.push(
      ...createBlindingOutputs(
        context,
        `${padFootingType.blindingThickness}mm blinding under pad footings`,
        blinding,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 6. SOIL POISON
  if (padFootingType.soilPoison) {
    const area = (padFootingType.excavationLength / 1000) * (padFootingType.excavationWidth / 1000) * qty;
    outputs.push(
      ...createSoilPoisonOutputs(
        context,
        "Soil poisoning to pad footings",
        area,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 7. BACKFILL
  if (padFootingType.backfill) {
    const backfill = excavationVol - padConcrete;
    outputs.push(
      ...createBackfillOutputs(
        context,
        "Backfill to pad footings",
        backfill,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  return outputs;
}

// ============================================================
// OPENING MEASUREMENT OUTPUT GENERATOR
// ============================================================

export function generateOpeningMeasurementOutputs(
  measurement: OpeningMeasurement,
  openingType: OpeningType,
  context: OutputContext
): MeasurementOutput[] {
  const outputs: MeasurementOutput[] = [];
  
  const qty = measurement.quantity || openingType.quantity || 1;
  const width = openingType.widthMm / 1000;
  const height = openingType.heightMm / 1000;
  const perimeter = 2 * height + width;
  const wallThickness = openingType.wallThicknessOption === "Half brick" ? 0.102
    : openingType.wallThicknessOption === "One brick" ? 0.215
    : (openingType.wallThicknessMm || 0) / 1000;
  
  // 1. LINTEL
  if (openingType.includeLintel) {
    const lintelLength = (openingType.widthMm + 2 * openingType.lintelBearingMm) / 1000;
    let category = "";
    if (lintelLength <= 3.0) category = "not exceeding 3.0m";
    else if (lintelLength <= 4.5) category = "exceeding 3.0m but not exceeding 4.5m";
    else if (lintelLength <= 6.0) category = "exceeding 4.5m but not exceeding 6.0m";
    else if (lintelLength <= 7.5) category = "exceeding 6.0m but not exceeding 7.5m";
    else category = "exceeding 7.5m";
    const desc = `Prestressed concrete lintel ${category} over openings`;
    outputs.push(
      ...createLintelOutputs(
        context,
        desc,
        lintelLength * qty,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 2. REVEAL PLASTER & PAINT
  if (openingType.includeRevealPlaster && wallThickness > 0) {
    const area = perimeter * wallThickness;
    const descPlaster = `Plaster to narrow widths around ${openingType.category.toLowerCase()} openings`;
    outputs.push(
      ...createRevealPlasterOutputs(
        context,
        descPlaster,
        area * qty,
        context.sectionId,
        context.elementId
      )
    );
    const descPaint = `Paint to narrow widths around ${openingType.category.toLowerCase()} openings`;
    outputs.push(
      ...createPaintOutputs(
        context,
        descPaint,
        area * qty,
        context.sectionId,
        context.elementId
      )
    );
  }
  
  // 3. DOOR-SPECIFIC
  if (openingType.category === "Door") {
    const config = openingType.doorConfiguration || "Single";
    const leafType = openingType.doorLeafType || "Hollow core timber door";
    const frameType = openingType.doorFrameType || "Timber frame";
    const doorW = openingType.widthMm;
    const doorH = openingType.heightMm;
    
    let leafBill = "CARPENTRY";
    if (leafType.includes("Aluminium") || leafType.includes("Steel")) leafBill = "METALWORK";
    const leafDesc = `${config} ${leafType} ${doorW} x ${doorH}mm high`;
    outputs.push(
      ...createDoorOutputs(
        context,
        leafDesc,
        qty,
        leafBill,
        context.sectionId,
        context.elementId
      )
    );
    
    let frameBill = "CARPENTRY";
    if (frameType !== "Timber frame") frameBill = "METALWORK";
    let frameLen = 2 * doorH + doorW;
    if (openingType.includeThreshold) frameLen += doorW;
    const frameLenM = frameLen / 1000;
    const frameDesc = `${frameType} for ${config} door`;
    outputs.push(
      ...createFrameOutputs(
        context,
        frameDesc,
        frameLenM * qty,
        frameBill,
        context.sectionId,
        context.elementId
      )
    );
    
    if (openingType.includeIronmongery) {
      outputs.push(
        ...createIronmongeryOutputs(
          context,
          "Standard ironmongery set",
          qty,
          context.sectionId,
          context.elementId
        )
      );
    }
    
    if (openingType.paintDoor) {
      const paintArea = (doorW / 1000) * (doorH / 1000) * 2;
      outputs.push(
        ...createPaintOutputs(
          context,
          "Paint to doors",
          paintArea * qty,
          context.sectionId,
          context.elementId
        )
      );
    }
    if (openingType.paintFrame) {
      const paintArea = frameLenM * 0.1;
      outputs.push(
        ...createPaintOutputs(
          context,
          "Paint to door frames",
          paintArea * qty,
          context.sectionId,
          context.elementId
        )
      );
    }
  }
  
  // 4. WINDOW-SPECIFIC
  if (openingType.category === "Window") {
    const winType = openingType.windowType || "Aluminium window";
    const winW = openingType.widthMm;
    const winH = openingType.heightMm;
    
    let winBill = "METALWORK";
    if (winType.includes("Timber")) winBill = "CARPENTRY";
    const winDesc = `${winType} ${winW} x ${winH}mm high`;
    outputs.push(
      ...createWindowOutputs(
        context,
        winDesc,
        qty,
        winBill,
        context.sectionId,
        context.elementId
      )
    );
    
    if (openingType.externalSill) {
      const sillLen = winW / 1000;
      outputs.push(
        ...createSillOutputs(
          context,
          "External sill to window openings",
          sillLen * qty,
          "MASONRY",
          context.sectionId,
          context.elementId
        )
      );
    }
    if (openingType.internalSill) {
      const sillLen = winW / 1000;
      outputs.push(
        ...createSillOutputs(
          context,
          "Internal sill to window openings",
          sillLen * qty,
          "CARPENTRY",
          context.sectionId,
          context.elementId
        )
      );
    }
    if (openingType.paintFrame) {
      const framePerim = 2 * (winW + winH) / 1000;
      const paintArea = framePerim * 0.1;
      outputs.push(
        ...createPaintOutputs(
          context,
          "Paint to window frames",
          paintArea * qty,
          context.sectionId,
          context.elementId
        )
      );
    }
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

// ============================================================
// WRAPPER FUNCTIONS
// ============================================================

// WALLS
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

// SLABS
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

// BEAMS
export function generateBeamCostPlanComponents(
  beamMeasurements: BeamMeasurement[],
  beamTypes: BeamType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  beamMeasurements.forEach((measurement) => {
    const beamType = beamTypes.find((b) => b.id === measurement.beamTypeId);
    if (!beamType) return;

    const outputs = generateBeamMeasurementOutputs(measurement, beamType, {
      module: "Beams",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "structural-frame",
      elementId: "beams",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateBeamBoqItems(
  beamMeasurements: BeamMeasurement[],
  beamTypes: BeamType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  beamMeasurements.forEach((measurement) => {
    const beamType = beamTypes.find((b) => b.id === measurement.beamTypeId);
    if (!beamType) return;

    const outputs = generateBeamMeasurementOutputs(measurement, beamType, {
      module: "Beams",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "structural-frame",
      elementId: "beams",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// COLUMNS
export function generateColumnCostPlanComponents(
  columnMeasurements: ColumnMeasurement[],
  columnTypes: ColumnType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  columnMeasurements.forEach((measurement) => {
    const columnType = columnTypes.find((c) => c.id === measurement.columnTypeId);
    if (!columnType) return;

    const outputs = generateColumnMeasurementOutputs(measurement, columnType, {
      module: "Columns",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "structural-frame",
      elementId: "columns",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateColumnBoqItems(
  columnMeasurements: ColumnMeasurement[],
  columnTypes: ColumnType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  columnMeasurements.forEach((measurement) => {
    const columnType = columnTypes.find((c) => c.id === measurement.columnTypeId);
    if (!columnType) return;

    const outputs = generateColumnMeasurementOutputs(measurement, columnType, {
      module: "Columns",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "structural-frame",
      elementId: "columns",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// SURFACE BEDS
export function generateSurfaceBedCostPlanComponents(
  surfaceBedMeasurements: SurfaceBedMeasurement[],
  surfaceBedTypes: SurfaceBedType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  surfaceBedMeasurements.forEach((measurement) => {
    const surfaceBedType = surfaceBedTypes.find((s) => s.id === measurement.surfaceBedTypeId);
    if (!surfaceBedType) return;

    const outputs = generateSurfaceBedMeasurementOutputs(measurement, surfaceBedType, {
      module: "SurfaceBeds",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "ground-floor",
      elementId: "solid-floors",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateSurfaceBedBoqItems(
  surfaceBedMeasurements: SurfaceBedMeasurement[],
  surfaceBedTypes: SurfaceBedType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  surfaceBedMeasurements.forEach((measurement) => {
    const surfaceBedType = surfaceBedTypes.find((s) => s.id === measurement.surfaceBedTypeId);
    if (!surfaceBedType) return;

    const outputs = generateSurfaceBedMeasurementOutputs(measurement, surfaceBedType, {
      module: "SurfaceBeds",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "ground-floor",
      elementId: "solid-floors",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// GROUND BEAMS
export function generateGroundBeamCostPlanComponents(
  groundBeamMeasurements: GroundBeamMeasurement[],
  groundBeamTypes: GroundBeamType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  groundBeamMeasurements.forEach((measurement) => {
    const groundBeamType = groundBeamTypes.find((g) => g.id === measurement.groundBeamTypeId);
    if (!groundBeamType) return;

    const outputs = generateGroundBeamMeasurementOutputs(measurement, groundBeamType, {
      module: "GroundBeams",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "substructure",
      elementId: "ground-beams",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateGroundBeamBoqItems(
  groundBeamMeasurements: GroundBeamMeasurement[],
  groundBeamTypes: GroundBeamType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  groundBeamMeasurements.forEach((measurement) => {
    const groundBeamType = groundBeamTypes.find((g) => g.id === measurement.groundBeamTypeId);
    if (!groundBeamType) return;

    const outputs = generateGroundBeamMeasurementOutputs(measurement, groundBeamType, {
      module: "GroundBeams",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "substructure",
      elementId: "ground-beams",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// PAD FOOTINGS
export function generatePadFootingCostPlanComponents(
  padFootingMeasurements: PadFootingMeasurement[],
  padFootingTypes: PadFootingType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  padFootingMeasurements.forEach((measurement) => {
    const padFootingType = padFootingTypes.find((p) => p.id === measurement.padFootingTypeId);
    if (!padFootingType) return;

    const outputs = generatePadFootingMeasurementOutputs(measurement, padFootingType, {
      module: "PadFootings",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "substructure",
      elementId: "pad-footings",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generatePadFootingBoqItems(
  padFootingMeasurements: PadFootingMeasurement[],
  padFootingTypes: PadFootingType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  padFootingMeasurements.forEach((measurement) => {
    const padFootingType = padFootingTypes.find((p) => p.id === measurement.padFootingTypeId);
    if (!padFootingType) return;

    const outputs = generatePadFootingMeasurementOutputs(measurement, padFootingType, {
      module: "PadFootings",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "substructure",
      elementId: "pad-footings",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}

// OPENINGS
export function generateOpeningCostPlanComponents(
  openingMeasurements: OpeningMeasurement[],
  openingTypes: OpeningType[]
): CostPlanComponent[] {
  const allOutputs: MeasurementOutput[] = [];

  openingMeasurements.forEach((measurement) => {
    const openingType = openingTypes.find((o) => o.id === measurement.openingTypeId);
    if (!openingType) return;

    const outputs = generateOpeningMeasurementOutputs(measurement, openingType, {
      module: "Openings",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "internal-divisions",
      elementId: "openings",
    });

    allOutputs.push(...outputs);
  });

  return measurementOutputsToCostPlanComponents(allOutputs);
}

export function generateOpeningBoqItems(
  openingMeasurements: OpeningMeasurement[],
  openingTypes: OpeningType[],
  boqItems: Record<string, BoqItem>
): Record<string, BoqItem> {
  const allOutputs: MeasurementOutput[] = [];

  openingMeasurements.forEach((measurement) => {
    const openingType = openingTypes.find((o) => o.id === measurement.openingTypeId);
    if (!openingType) return;

    const outputs = generateOpeningMeasurementOutputs(measurement, openingType, {
      module: "Openings",
      measurementId: measurement.id,
      mark: measurement.mark,
      sectionId: "internal-divisions",
      elementId: "openings",
    });

    allOutputs.push(...outputs);
  });

  return generateBoqItemsFromOutputs(allOutputs, boqItems);
}