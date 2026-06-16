"use client";

import { useState } from "react";
import type {
  BeamType,
  BeamMeasurement,
  SurfaceBedType,
  SurfaceBedMeasurement,
  PadFootingType,
  PadFootingMeasurement,
  GroundBeamType,
  GroundBeamMeasurement,
  ColumnType,
  ColumnMeasurement,
  BrickType,
  WallThicknessType,
  WallType,
  WallMeasurement,
  SlabType,
  SlabMeasurement,
  BoqItem,
} from "@/types/boq";
import {
  addToBoqItem,
  addLayerToBoq,
} from "@/lib/boqHelpers";

// Import all module components
import BeamModule from "@/components/BeamModule";
import SurfaceBedModule from "@/components/SurfaceBedModule";
import PadFootingModule from "@/components/PadFootingModule";
import GroundBeamModule from "@/components/GroundBeamModule";
import ColumnModule from "@/components/ColumnModule";
import WallModule from "@/components/WallModule";
import SlabModule from "@/components/SlabModule";

// CUSTOM HOOK
function useFormState<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const reset = () => setValues(initialState);
  const update = (partial: Partial<T>) => setValues((prev) => ({ ...prev, ...partial }));
  return { values, update, reset };
}

// ============================================
// STYLES
// ============================================
const pageStyle = {
  padding: "30px",
  fontFamily: "Arial",
  maxWidth: "1600px",
  width: "95%",
  margin: "0 auto",
  backgroundColor: "#f4f6f8",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "24px 32px",
  marginTop: "25px",
  backgroundColor: "#ffffff",
};

const thStyle = { padding: "8px 12px", textAlign: "left" as const };
const tdStyle = { padding: "8px 12px" };
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginTop: "10px",
  backgroundColor: "#ffffff",
};

const styles = { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle };

// ============================================
// MAIN COMPONENT
// ============================================
export default function Home() {
  // BEAM STATE
  const [beamTypes, setBeamTypes] = useState<BeamType[]>([
    { id: 1, name: "Main Roof Beam", width: 230, depth: 500, reinfKg: 120, formworkFinish: "Smooth", concreteClass: "25MPa/19mm" },
  ]);
  const [editingBeamId, setEditingBeamId] = useState<number | null>(null);
  const { values: newBeam, update: updateBeam, reset: resetBeam } = useFormState({
    name: "", width: 230, depth: 500, reinfKg: 120, formworkFinish: "Smooth", concreteClass: "25MPa/19mm",
  });
  const [beamMeasurements, setBeamMeasurements] = useState<BeamMeasurement[]>([]);
  const { values: newBeamMeas, update: updateBeamMeas, reset: resetBeamMeas } = useFormState({
    mark: "", beamTypeId: 0, length: 0,
  });

  // SURFACE BED STATE
const [surfaceBedTypes, setSurfaceBedTypes] = useState<SurfaceBedType[]>([]);
  const [editingSurfaceBedId, setEditingSurfaceBedId] = useState<number | null>(null);
  const defaultSurfaceBed = {
    name: "", category: "Internal", thickness: 170, concreteClass: "35MPa/19mm", meshType: "Ref193",
    dpm: true, soilPoison: true, layer1Material: "", layer1Thickness: 0, layer2Material: "", layer2Thickness: 0,
    layer3Material: "", layer3Thickness: 0, powerfloat: true, screedRequired: false, screedThickness: 40,
    screedType: "Normal", tileRequired: false, tilePcSum: 0,
  };
  const { values: newSurfaceBed, update: updateSurfaceBed, reset: resetSurfaceBed } = useFormState(defaultSurfaceBed);
  const [surfaceBedMeasurements, setSurfaceBedMeasurements] = useState<SurfaceBedMeasurement[]>([]);
  const { values: newSurfaceBedMeas, update: updateSurfaceBedMeas, reset: resetSurfaceBedMeas } = useFormState({
    mark: "", surfaceBedTypeId: 0, area: 0,
  });

  // PAD FOOTING STATE
  const [padFootingTypes, setPadFootingTypes] = useState<PadFootingType[]>([
    { id: 1, name: "Test Pad Footing", padLength: 1200, padWidth: 1200, padDepth: 400, excavationLength: 1800, excavationWidth: 1800, excavationDepth: 800, concreteClass: "30MPa/19mm", reinfKg: 120, formworkRequired: true, blindingRequired: true, blindingThickness: 50, soilPoison: false, backfill: true },
  ]);
  const [editingPadFootingId, setEditingPadFootingId] = useState<number | null>(null);
  const defaultPadFooting = {
    name: "", padLength: 1200, padWidth: 1200, padDepth: 400, excavationLength: 1800, excavationWidth: 1800,
    excavationDepth: 800, concreteClass: "30MPa/19mm", reinfKg: 120, formworkRequired: true, blindingRequired: true,
    blindingThickness: 50, soilPoison: false, backfill: true,
  };
  const { values: newPadFooting, update: updatePadFooting, reset: resetPadFooting } = useFormState(defaultPadFooting);
  const [padFootingMeasurements, setPadFootingMeasurements] = useState<PadFootingMeasurement[]>([]);
  const { values: newPadFootingMeas, update: updatePadFootingMeas, reset: resetPadFootingMeas } = useFormState({
    mark: "", padFootingTypeId: 0, quantity: 0,
  });

  // GROUND BEAM STATE
  const [groundBeamTypes, setGroundBeamTypes] = useState<GroundBeamType[]>([
    { id: 1, name: "Test Ground Beam", trenchWidth: 600, trenchDepth: 1000, beamWidth: 350, beamDepth: 600, concreteClass: "30MPa/19mm", reinfKgPerM3: 150, formworkRequired: true, blindingRequired: true, blindingThickness: 50, backfillRequired: true, dpcRequired: false, soilPoisonRequired: false },
  ]);
  const [editingGroundBeamId, setEditingGroundBeamId] = useState<number | null>(null);
  const defaultGroundBeam = {
    name: "", trenchWidth: 600, trenchDepth: 1000, beamWidth: 350, beamDepth: 600,
    concreteClass: "30MPa/19mm", reinfKgPerM3: 150, formworkRequired: true,
    blindingRequired: true, blindingThickness: 50, backfillRequired: true,
    dpcRequired: false, soilPoisonRequired: false,
  };
  const { values: newGroundBeam, update: updateGroundBeam, reset: resetGroundBeam } = useFormState(defaultGroundBeam);
  const [groundBeamMeasurements, setGroundBeamMeasurements] = useState<GroundBeamMeasurement[]>([]);
  const { values: newGroundBeamMeas, update: updateGroundBeamMeas, reset: resetGroundBeamMeas } = useFormState({
    mark: "", groundBeamTypeId: 0, length: 0,
  });

  // COLUMN STATE
  const [columnTypes, setColumnTypes] = useState<ColumnType[]>([
    { id: 1, name: "Test Column", width: 300, depth: 300, height: 3000, concreteClass: "35MPa/19mm", reinfKgPerM3: 200, formworkRequired: true, formworkFinish: "Smooth" },
  ]);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const defaultColumn = {
    name: "", width: 300, depth: 300, height: 3000, concreteClass: "35MPa/19mm",
    reinfKgPerM3: 200, formworkRequired: true, formworkFinish: "Smooth",
  };
  const { values: newColumn, update: updateColumn, reset: resetColumn } = useFormState(defaultColumn);
  const [columnMeasurements, setColumnMeasurements] = useState<ColumnMeasurement[]>([]);
  const { values: newColumnMeas, update: updateColumnMeas, reset: resetColumnMeas } = useFormState({
    mark: "", columnTypeId: 0, quantity: 0,
  });

  // WALL STATE
  const [wallTypes, setWallTypes] = useState<WallType[]>([
    { id: 1, name: "Test Wall", brickType: "Common", thicknessType: "Single Skin (Half Brick)", thicknessMm: 102, courseHeight: 75, plasterBothSides: true, plasterThickness: 13, paintRequired: true, dpcRequired: true, reinforcementRequired: false, coursesPerReinforcement: 4, reinforcementType: "Galvanised mesh", tilesInternal: false, tilesExternal: false, tilePcSumInternal: 0, tilePcSumExternal: 0 },
  ]);
  const [editingWallId, setEditingWallId] = useState<number | null>(null);
  const defaultWall = {
    name: "",
    brickType: "Common" as BrickType,
    thicknessType: "Single Skin (Half Brick)" as WallThicknessType,
    thicknessMm: 102,
    courseHeight: 75,
    plasterBothSides: true,
    plasterThickness: 13,
    paintRequired: true,
    dpcRequired: true,
    reinforcementRequired: false,
    coursesPerReinforcement: 4,
    reinforcementType: "Galvanised mesh",
    tilesInternal: false,
    tilesExternal: false,
    tilePcSumInternal: 0,
    tilePcSumExternal: 0,
  };
  const { values: newWall, update: updateWall, reset: resetWall } = useFormState(defaultWall);
  const [wallMeasurements, setWallMeasurements] = useState<WallMeasurement[]>([]);
  const { values: newWallMeas, update: updateWallMeas, reset: resetWallMeas } = useFormState({
    mark: "", wallTypeId: 0, length: 0, height: 0, area: 0,
  });

  // SLAB STATE
  const [slabTypes, setSlabTypes] = useState<SlabType[]>([
    { id: 1, name: "Test Slab", thickness: 175, concreteClass: "30MPa/19mm", reinfType: "Rebar", reinfKgPerM3: 120, meshType: "A193", formworkToEdges: true, screedRequired: false, screedThickness: 50, floorFinishPcSum: 0, floorFinishDescription: "Tiles" },
  ]);
  const [editingSlabId, setEditingSlabId] = useState<number | null>(null);
  const defaultSlab = {
    name: "", thickness: 175, concreteClass: "30MPa/19mm", reinfType: "Rebar" as "Mesh" | "Rebar",
    reinfKgPerM3: 120, meshType: "A193", formworkToEdges: true, screedRequired: false,
    screedThickness: 50, floorFinishPcSum: 0, floorFinishDescription: "Tiles",
  };
  const { values: newSlab, update: updateSlab, reset: resetSlab } = useFormState(defaultSlab);
  const [slabMeasurements, setSlabMeasurements] = useState<SlabMeasurement[]>([]);
  const { values: newSlabMeas, update: updateSlabMeas, reset: resetSlabMeas } = useFormState({
    mark: "", slabTypeId: 0, length: 0, width: 0, quantity: 1, area: 0,
  });

  // ============================================
  // BOQ CALCULATIONS
  // ============================================
  const finalBoqItems: Record<string, BoqItem> = {};

  // Beams
  beamMeasurements.forEach((m) => {
    const beam = beamTypes.find((b) => b.id === m.beamTypeId);
    if (!beam) return;
    const widthM = beam.width / 1000;
    const depthM = beam.depth / 1000;
    const concrete = widthM * depthM * m.length;
    const formwork = m.length * (2 * depthM + widthM);
    const reinforcement = (concrete * beam.reinfKg) / 1000;
    addToBoqItem(finalBoqItems, `${beam.concreteClass} concrete in beams`, "m³", concrete);
    addToBoqItem(finalBoqItems, `${beam.formworkFinish} formwork to beams`, "m²", formwork);
    addToBoqItem(finalBoqItems, "Reinforcement in beams", "t", reinforcement);
  });

  // Surface Beds
  surfaceBedMeasurements.forEach((m) => {
    const sb = surfaceBedTypes.find((s) => s.id === m.surfaceBedTypeId);
    if (!sb) return;
    const concreteVol = m.area * (sb.thickness / 1000);
    addLayerToBoq(finalBoqItems, sb.layer1Material, sb.layer1Thickness, m.area);
    addLayerToBoq(finalBoqItems, sb.layer2Material, sb.layer2Thickness, m.area);
    addLayerToBoq(finalBoqItems, sb.layer3Material, sb.layer3Thickness, m.area);
    if (sb.dpm) addToBoqItem(finalBoqItems, "DPM under surface beds", "m²", m.area);
    if (sb.soilPoison) addToBoqItem(finalBoqItems, "Soil poisoning under surface beds", "m²", m.area);
    if (sb.meshType !== "None") addToBoqItem(finalBoqItems, `${sb.meshType} mesh reinforcement`, "m²", m.area);
    addToBoqItem(finalBoqItems, `${sb.concreteClass} concrete in surface beds`, "m³", concreteVol);
    if (sb.screedRequired) addToBoqItem(finalBoqItems, `${sb.screedThickness}mm screed ${sb.screedType}`, "m²", m.area);
    if (sb.tileRequired) addToBoqItem(finalBoqItems, `Tiles PC Sum R${sb.tilePcSum}/m²`, "m²", m.area);
    if (sb.powerfloat) addToBoqItem(finalBoqItems, "Powerfloat finish", "m²", m.area);
  });

  // Pad Footings
  padFootingMeasurements.forEach((m) => {
    const pf = padFootingTypes.find((p) => p.id === m.padFootingTypeId);
    if (!pf) return;
    const qty = m.quantity;
    const padConcrete = (pf.padLength / 1000) * (pf.padWidth / 1000) * (pf.padDepth / 1000) * qty;
    const excavationVol = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * (pf.excavationDepth / 1000) * qty;
    const reinforcementTonnes = (padConcrete * pf.reinfKg) / 1000;
    addToBoqItem(finalBoqItems, `${pf.concreteClass} concrete in pad footings`, "m³", padConcrete);
    addToBoqItem(finalBoqItems, "Excavation for pad footings", "m³", excavationVol);
    addToBoqItem(finalBoqItems, "Reinforcement in pad footings", "t", reinforcementTonnes);
    if (pf.formworkRequired) {
      const formwork = 2 * ((pf.padLength / 1000) + (pf.padWidth / 1000)) * (pf.padDepth / 1000) * qty;
      addToBoqItem(finalBoqItems, "Formwork to pad footings", "m²", formwork);
    }
    if (pf.blindingRequired) {
      const blinding = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * (pf.blindingThickness / 1000) * qty;
      addToBoqItem(finalBoqItems, `${pf.blindingThickness}mm blinding under pad footings`, "m³", blinding);
    }
    if (pf.soilPoison) {
      const soilPoisonArea = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * qty;
      addToBoqItem(finalBoqItems, "Soil poisoning to pad footings", "m²", soilPoisonArea);
    }
    if (pf.backfill) {
      const backfillVol = excavationVol - padConcrete;
      addToBoqItem(finalBoqItems, "Backfill to pad footings", "m³", backfillVol);
    }
  });

  // Ground Beams
  groundBeamMeasurements.forEach((m) => {
    const gb = groundBeamTypes.find((g) => g.id === m.groundBeamTypeId);
    if (!gb) return;
    const length = m.length;
    const trenchVol = (gb.trenchWidth / 1000) * (gb.trenchDepth / 1000) * length;
    const concreteVol = (gb.beamWidth / 1000) * (gb.beamDepth / 1000) * length;
    const reinforcementTonnes = (concreteVol * gb.reinfKgPerM3) / 1000;
    addToBoqItem(finalBoqItems, "Excavation for ground beams", "m³", trenchVol);
    addToBoqItem(finalBoqItems, `${gb.concreteClass} concrete in ground beams`, "m³", concreteVol);
    addToBoqItem(finalBoqItems, "Reinforcement in ground beams", "t", reinforcementTonnes);
    if (gb.formworkRequired) {
      const formwork = (gb.beamDepth / 1000) * length * 2;
      addToBoqItem(finalBoqItems, "Formwork to sides of ground beams", "m²", formwork);
    }
    if (gb.blindingRequired) {
      const blindingVol = (gb.beamWidth / 1000) * (gb.blindingThickness / 1000) * length;
      addToBoqItem(finalBoqItems, `${gb.blindingThickness}mm blinding under ground beams`, "m³", blindingVol);
    }
    if (gb.backfillRequired) {
      const backfillVol = trenchVol - concreteVol;
      addToBoqItem(finalBoqItems, "Backfill to ground beams", "m³", backfillVol);
    }
    if (gb.dpcRequired) {
      const dpcArea = (gb.beamWidth / 1000) * length;
      addToBoqItem(finalBoqItems, "DPC to ground beams", "m²", dpcArea);
    }
    if (gb.soilPoisonRequired) {
      const soilPoisonArea = (gb.trenchWidth / 1000) * length;
      addToBoqItem(finalBoqItems, "Soil poisoning under ground beams", "m²", soilPoisonArea);
    }
  });

  // Columns
  columnMeasurements.forEach((m) => {
    const col = columnTypes.find((c) => c.id === m.columnTypeId);
    if (!col) return;
    const qty = m.quantity;
    const concreteVol = (col.width / 1000) * (col.depth / 1000) * (col.height / 1000) * qty;
    const reinforcementTonnes = (concreteVol * col.reinfKgPerM3) / 1000;
    addToBoqItem(finalBoqItems, `${col.concreteClass} concrete in columns`, "m³", concreteVol);
    addToBoqItem(finalBoqItems, "Reinforcement in columns", "t", reinforcementTonnes);
    if (col.formworkRequired) {
      const perimeter = 2 * ((col.width / 1000) + (col.depth / 1000));
      const formworkArea = perimeter * (col.height / 1000) * qty;
      addToBoqItem(finalBoqItems, `${col.formworkFinish} formwork to columns`, "m²", formworkArea);
    }
  });

  // Walls
  wallMeasurements.forEach((m) => {
    const wall = wallTypes.find((w) => w.id === m.wallTypeId);
    if (!wall) return;
    const area = m.area;
    
    addToBoqItem(finalBoqItems, `${wall.brickType} brickwork - ${wall.thicknessType}`, "m²", area);
    
    if (wall.plasterBothSides) {
      addToBoqItem(finalBoqItems, `Plaster to walls (both sides) - ${wall.thicknessType}`, "m²", area * 2);
    }
    
    if (wall.paintRequired) {
      addToBoqItem(finalBoqItems, "Paint to walls", "m²", area * 2);
    }
    
    if (wall.dpcRequired) {
      addToBoqItem(finalBoqItems, "Damp-proof course", "m", m.length);
    }
    
    if (wall.reinforcementRequired) {
      const numberOfLayers = Math.floor((m.height * 1000) / (wall.courseHeight * wall.coursesPerReinforcement));
      addToBoqItem(finalBoqItems, `Bed joint reinforcement (${wall.reinforcementType})`, "m", m.length * numberOfLayers);
    }
    
    if (wall.tilesInternal) {
      addToBoqItem(finalBoqItems, `Wall tiles internal - PC Sum R${wall.tilePcSumInternal}/m²`, "m²", area);
    }
    
    if (wall.tilesExternal) {
      addToBoqItem(finalBoqItems, `Wall tiles external - PC Sum R${wall.tilePcSumExternal}/m²`, "m²", area);
    }
  });

  // Slabs
  slabMeasurements.forEach((m) => {
    const slab = slabTypes.find((s) => s.id === m.slabTypeId);
    if (!slab) return;
    const area = m.area;
    const concreteVol = area * (slab.thickness / 1000);
    addToBoqItem(finalBoqItems, `${slab.concreteClass} concrete in suspended slab`, "m³", concreteVol);
    if (slab.reinfType === "Rebar") {
      const reinfTonnes = (concreteVol * slab.reinfKgPerM3) / 1000;
      addToBoqItem(finalBoqItems, "Reinforcement to slab (rebar)", "t", reinfTonnes);
    } else if (slab.reinfType === "Mesh" && slab.meshType && slab.meshType !== "None") {
      addToBoqItem(finalBoqItems, `${slab.meshType} mesh reinforcement`, "m²", area);
    }
    if (slab.formworkToEdges) {
      const perimeter = 2 * (m.length + m.width) * m.quantity;
      const formworkArea = perimeter * (slab.thickness / 1000);
      addToBoqItem(finalBoqItems, "Formwork to slab edges", "m²", formworkArea);
    }
    if (slab.screedRequired) {
      addToBoqItem(finalBoqItems, `${slab.screedThickness}mm screed to slab`, "m²", area);
    }
    if (slab.floorFinishPcSum > 0) {
      addToBoqItem(finalBoqItems, `${slab.floorFinishDescription} floor finish PC R${slab.floorFinishPcSum}/m²`, "m²", area);
    }
  });

  // ============================================
  // RENDER
  // ============================================
  return (
    <main style={pageStyle}>
      <h1>BOQ Measurement Software</h1>
      
      {/* BOQ SUMMARY */}
      <h2>Generated BOQ Summary</h2>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>BOQ Item</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(finalBoqItems).map((row) => (
            <tr key={row.item}>
              <td style={tdStyle}>{row.item}</td>
              <td style={tdStyle}>{row.unit}</td>
              <td style={tdStyle}>{row.qty.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BEAM MODULE */}
      <BeamModule
        beamTypes={beamTypes}
        setBeamTypes={setBeamTypes}
        editingBeamId={editingBeamId}
        setEditingBeamId={setEditingBeamId}
        newBeam={newBeam}
        updateBeam={updateBeam}
        resetBeam={resetBeam}
        beamMeasurements={beamMeasurements}
        setBeamMeasurements={setBeamMeasurements}
        newBeamMeas={newBeamMeas}
        updateBeamMeas={updateBeamMeas}
        resetBeamMeas={resetBeamMeas}
        styles={styles}
      />

      {/* SURFACE BED MODULE */}
      <SurfaceBedModule
        surfaceBedTypes={surfaceBedTypes}
        setSurfaceBedTypes={setSurfaceBedTypes}
        editingSurfaceBedId={editingSurfaceBedId}
        setEditingSurfaceBedId={setEditingSurfaceBedId}
        newSurfaceBed={newSurfaceBed}
        updateSurfaceBed={updateSurfaceBed}
        resetSurfaceBed={resetSurfaceBed}
        surfaceBedMeasurements={surfaceBedMeasurements}
        setSurfaceBedMeasurements={setSurfaceBedMeasurements}
        newSurfaceBedMeas={newSurfaceBedMeas}
        updateSurfaceBedMeas={updateSurfaceBedMeas}
        resetSurfaceBedMeas={resetSurfaceBedMeas}
        styles={styles}
      />

      {/* PAD FOOTING MODULE */}
      <PadFootingModule
        padFootingTypes={padFootingTypes}
        setPadFootingTypes={setPadFootingTypes}
        editingPadFootingId={editingPadFootingId}
        setEditingPadFootingId={setEditingPadFootingId}
        newPadFooting={newPadFooting}
        updatePadFooting={updatePadFooting}
        resetPadFooting={resetPadFooting}
        padFootingMeasurements={padFootingMeasurements}
        setPadFootingMeasurements={setPadFootingMeasurements}
        newPadFootingMeas={newPadFootingMeas}
        updatePadFootingMeas={updatePadFootingMeas}
        resetPadFootingMeas={resetPadFootingMeas}
        styles={styles}
      />

      {/* GROUND BEAM MODULE */}
      <GroundBeamModule
        groundBeamTypes={groundBeamTypes}
        setGroundBeamTypes={setGroundBeamTypes}
        editingGroundBeamId={editingGroundBeamId}
        setEditingGroundBeamId={setEditingGroundBeamId}
        newGroundBeam={newGroundBeam}
        updateGroundBeam={updateGroundBeam}
        resetGroundBeam={resetGroundBeam}
        groundBeamMeasurements={groundBeamMeasurements}
        setGroundBeamMeasurements={setGroundBeamMeasurements}
        newGroundBeamMeas={newGroundBeamMeas}
        updateGroundBeamMeas={updateGroundBeamMeas}
        resetGroundBeamMeas={resetGroundBeamMeas}
        styles={styles}
      />

      {/* COLUMN MODULE */}
      <ColumnModule
        columnTypes={columnTypes}
        setColumnTypes={setColumnTypes}
        editingColumnId={editingColumnId}
        setEditingColumnId={setEditingColumnId}
        newColumn={newColumn}
        updateColumn={updateColumn}
        resetColumn={resetColumn}
        columnMeasurements={columnMeasurements}
        setColumnMeasurements={setColumnMeasurements}
        newColumnMeas={newColumnMeas}
        updateColumnMeas={updateColumnMeas}
        resetColumnMeas={resetColumnMeas}
        styles={styles}
      />

      {/* WALL MODULE */}
      <WallModule
        wallTypes={wallTypes}
        setWallTypes={setWallTypes}
        editingWallId={editingWallId}
        setEditingWallId={setEditingWallId}
        newWall={newWall}
        updateWall={updateWall}
        resetWall={resetWall}
        wallMeasurements={wallMeasurements}
        setWallMeasurements={setWallMeasurements}
        newWallMeas={newWallMeas}
        updateWallMeas={updateWallMeas}
        resetWallMeas={resetWallMeas}
        styles={styles}
      />

      {/* SLAB MODULE */}
      <SlabModule
        slabTypes={slabTypes}
        setSlabTypes={setSlabTypes}
        editingSlabId={editingSlabId}
        setEditingSlabId={setEditingSlabId}
        newSlab={newSlab}
        updateSlab={updateSlab}
        resetSlab={resetSlab}
        slabMeasurements={slabMeasurements}
        setSlabMeasurements={setSlabMeasurements}
        newSlabMeas={newSlabMeas}
        updateSlabMeas={updateSlabMeas}
        resetSlabMeas={resetSlabMeas}
        styles={styles}
      />
    </main>
  );
}