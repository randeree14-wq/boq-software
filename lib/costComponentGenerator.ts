import { WallType, WallMeasurement, CostPlanComponent } from "@/types/boq";
import { generateWallCostPlanComponents } from "./measurementOutputEngine";

export function generateWallCostComponents(
  wallMeasurements: WallMeasurement[],
  wallTypes: WallType[]
): CostPlanComponent[] {
  return generateWallCostPlanComponents(wallMeasurements, wallTypes);
}

  wallMeasurements.forEach((measurement) => {
    const wallType = wallTypes.find((w) => w.id === measurement.wallTypeId);
    if (!wallType) return;

    const area = measurement.area;
    const mapping = getCostPlanMapping(measurement.wallLocation || "Internal Division");

    // ============================================================
    // 1. STRUCTURE (Brickwork)
    // ============================================================
    components.push({
      id: `${measurement.id}-structure`,
      measurementId: measurement.id,
      mark: measurement.mark,
      module: "Walls",
      elementalSectionId: mapping.structure.sectionId,
      elementalElementId: mapping.structure.elementId,
      description: `${wallType.brickType} brickwork - ${wallType.thicknessType}`,
      unit: "m²",
      qty: area,
    });

    // ============================================================
    // 2. SIDE 1 FINISHES
    // ============================================================
    
    // 2a. Side 1 Plaster
    if (wallType.side1Plaster) {
      components.push({
        id: `${measurement.id}-side1-plaster`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.side1Finish.sectionId,
        elementalElementId: mapping.side1Finish.elementId,
        description: `Plaster to walls (Side 1)`,
        unit: "m²",
        qty: area,
      });
    }

    // 2b. Side 1 Finish (Paint or Tile)
    if (wallType.side1Finish === "Paint") {
      components.push({
        id: `${measurement.id}-side1-paint`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.side1Finish.sectionId,
        elementalElementId: mapping.side1Finish.elementId,
        description: `Paint to walls (Side 1)`,
        unit: "m²",
        qty: area,
      });
    }

    if (wallType.side1Finish === "Tile") {
      components.push({
        id: `${measurement.id}-side1-tile`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.side1Finish.sectionId,
        elementalElementId: mapping.side1Finish.elementId,
        description: `Tile finish to walls (Side 1)`,
        unit: "m²",
        qty: area,
        rate: wallType.side1TilePcSum || 0,
        amount: area * (wallType.side1TilePcSum || 0),
      });
    }

    // ============================================================
    // 3. SIDE 2 FINISHES
    // ============================================================
    
    // 3a. Side 2 Plaster
    if (wallType.side2Plaster) {
      components.push({
        id: `${measurement.id}-side2-plaster`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.side2Finish.sectionId,
        elementalElementId: mapping.side2Finish.elementId,
        description: `Plaster to walls (Side 2)`,
        unit: "m²",
        qty: area,
      });
    }

    // 3b. Side 2 Finish (Paint or Tile)
    if (wallType.side2Finish === "Paint") {
      components.push({
        id: `${measurement.id}-side2-paint`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.side2Finish.sectionId,
        elementalElementId: mapping.side2Finish.elementId,
        description: `Paint to walls (Side 2)`,
        unit: "m²",
        qty: area,
      });
    }

    if (wallType.side2Finish === "Tile") {
      components.push({
        id: `${measurement.id}-side2-tile`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.side2Finish.sectionId,
        elementalElementId: mapping.side2Finish.elementId,
        description: `Tile finish to walls (Side 2)`,
        unit: "m²",
        qty: area,
        rate: wallType.side2TilePcSum || 0,
        amount: area * (wallType.side2TilePcSum || 0),
      });
    }

    // ============================================================
    // 4. DPC
    // ============================================================
    if (wallType.dpcRequired) {
      components.push({
        id: `${measurement.id}-dpc`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.structure.sectionId,
        elementalElementId: mapping.structure.elementId,
        description: `DPC to walls`,
        unit: "m",
        qty: measurement.length,
      });
    }

    // ============================================================
    // 5. Reinforcement
    // ============================================================
    if (wallType.reinforcementRequired) {
      components.push({
        id: `${measurement.id}-reinf`,
        measurementId: measurement.id,
        mark: measurement.mark,
        module: "Walls",
        elementalSectionId: mapping.structure.sectionId,
        elementalElementId: mapping.structure.elementId,
        description: `Bed joint reinforcement (${wallType.coursesPerReinforcement || "?"} courses/layer)`,
        unit: "m²",
        qty: area,
      });
    }
  });

  return components;
}