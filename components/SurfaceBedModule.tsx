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
  getBrickDefaults,
  getThicknessFromType,
} from "@/lib/boqHelpers";
import BeamModule from "@/components/BeamModule";
import SurfaceBedModule from "@/components/SurfaceBedModule";

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
  const [padFootingTypes, setPadFootingTypes] = useState<PadFootingType[]>([]);
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
  const [groundBeamTypes, setGroundBeamTypes] = useState<GroundBeamType[]>([]);
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
  const [columnTypes, setColumnTypes] = useState<ColumnType[]>([]);
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
  const [wallTypes, setWallTypes] = useState<WallType[]>([]);
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
  const [slabTypes, setSlabTypes] = useState<SlabType[]>([]);
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
  // PAD FOOTING HANDLERS
  // ============================================
  function savePadFootingType() {
    if (!newPadFooting.name.trim()) return;
    if (editingPadFootingId !== null) {
      setPadFootingTypes((prev) => prev.map((pf) => (pf.id === editingPadFootingId ? { ...pf, ...newPadFooting } : pf)));
      setEditingPadFootingId(null);
    } else {
      setPadFootingTypes((prev) => [...prev, { id: Date.now(), ...newPadFooting }]);
    }
    resetPadFooting();
  }

  function editPadFootingType(id: number) {
    const pf = padFootingTypes.find((p) => p.id === id);
    if (pf) {
      updatePadFooting(pf);
      setEditingPadFootingId(id);
    }
  }

  function deletePadFootingType(id: number) {
    setPadFootingTypes((prev) => prev.filter((pf) => pf.id !== id));
    setPadFootingMeasurements((prev) => prev.filter((m) => m.padFootingTypeId !== id));
  }

  function addPadFootingMeasurement() {
    if (!newPadFootingMeas.mark.trim() || newPadFootingMeas.padFootingTypeId === 0 || newPadFootingMeas.quantity <= 0) return;
    setPadFootingMeasurements((prev) => [...prev, { id: Date.now(), ...newPadFootingMeas }]);
    resetPadFootingMeas();
  }

  // ============================================
  // GROUND BEAM HANDLERS
  // ============================================
  function saveGroundBeamType() {
    if (!newGroundBeam.name.trim()) return;
    if (editingGroundBeamId !== null) {
      setGroundBeamTypes((prev) => prev.map((gb) => (gb.id === editingGroundBeamId ? { ...gb, ...newGroundBeam } : gb)));
      setEditingGroundBeamId(null);
    } else {
      setGroundBeamTypes((prev) => [...prev, { id: Date.now(), ...newGroundBeam }]);
    }
    resetGroundBeam();
  }

  function editGroundBeamType(id: number) {
    const gb = groundBeamTypes.find((g) => g.id === id);
    if (gb) {
      updateGroundBeam(gb);
      setEditingGroundBeamId(id);
    }
  }

  function deleteGroundBeamType(id: number) {
    setGroundBeamTypes((prev) => prev.filter((gb) => gb.id !== id));
    setGroundBeamMeasurements((prev) => prev.filter((m) => m.groundBeamTypeId !== id));
  }

  function addGroundBeamMeasurement() {
    if (!newGroundBeamMeas.mark.trim() || newGroundBeamMeas.groundBeamTypeId === 0 || newGroundBeamMeas.length <= 0) return;
    setGroundBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newGroundBeamMeas }]);
    resetGroundBeamMeas();
  }

  // ============================================
  // COLUMN HANDLERS
  // ============================================
  function saveColumnType() {
    if (!newColumn.name.trim()) return;
    if (editingColumnId !== null) {
      setColumnTypes((prev) => prev.map((c) => (c.id === editingColumnId ? { ...c, ...newColumn } : c)));
      setEditingColumnId(null);
    } else {
      setColumnTypes((prev) => [...prev, { id: Date.now(), ...newColumn }]);
    }
    resetColumn();
  }

  function editColumnType(id: number) {
    const col = columnTypes.find((c) => c.id === id);
    if (col) {
      updateColumn(col);
      setEditingColumnId(id);
    }
  }

  function deleteColumnType(id: number) {
    setColumnTypes((prev) => prev.filter((c) => c.id !== id));
    setColumnMeasurements((prev) => prev.filter((m) => m.columnTypeId !== id));
  }

  function addColumnMeasurement() {
    if (!newColumnMeas.mark.trim() || newColumnMeas.columnTypeId === 0 || newColumnMeas.quantity <= 0) return;
    setColumnMeasurements((prev) => [...prev, { id: Date.now(), ...newColumnMeas }]);
    resetColumnMeas();
  }

  // ============================================
  // WALL HANDLERS
  // ============================================
  function handleThicknessTypeChange(type: WallThicknessType) {
    const thicknessMm = getThicknessFromType(type);
    updateWall({ thicknessType: type, thicknessMm });
  }

  function handleBrickTypeChange(type: BrickType) {
    const { courseHeight } = getBrickDefaults(type);
    updateWall({ brickType: type, courseHeight });
  }

  function saveWallType() {
    if (!newWall.name.trim()) return;
    if (editingWallId !== null) {
      setWallTypes((prev) => prev.map((w) => (w.id === editingWallId ? { ...w, ...newWall } : w)));
      setEditingWallId(null);
    } else {
      setWallTypes((prev) => [...prev, { id: Date.now(), ...newWall }]);
    }
    resetWall();
  }

  function editWallType(id: number) {
    const wall = wallTypes.find((w) => w.id === id);
    if (wall) {
      updateWall(wall);
      setEditingWallId(id);
    }
  }

  function deleteWallType(id: number) {
    setWallTypes((prev) => prev.filter((w) => w.id !== id));
    setWallMeasurements((prev) => prev.filter((m) => m.wallTypeId !== id));
  }

  function addWallMeasurement() {
    if (!newWallMeas.mark.trim() || newWallMeas.wallTypeId === 0 || newWallMeas.length <= 0 || newWallMeas.height <= 0) return;
    const area = newWallMeas.length * newWallMeas.height;
    setWallMeasurements((prev) => [...prev, { id: Date.now(), ...newWallMeas, area }]);
    resetWallMeas();
  }

  // ============================================
  // SLAB HANDLERS
  // ============================================
  function saveSlabType() {
    if (!newSlab.name.trim()) return;
    if (editingSlabId !== null) {
      setSlabTypes((prev) => prev.map((s) => (s.id === editingSlabId ? { ...s, ...newSlab } : s)));
      setEditingSlabId(null);
    } else {
      setSlabTypes((prev) => [...prev, { id: Date.now(), ...newSlab }]);
    }
    resetSlab();
  }

  function editSlabType(id: number) {
    const slab = slabTypes.find((s) => s.id === id);
    if (slab) {
      updateSlab(slab);
      setEditingSlabId(id);
    }
  }

  function deleteSlabType(id: number) {
    setSlabTypes((prev) => prev.filter((s) => s.id !== id));
    setSlabMeasurements((prev) => prev.filter((m) => m.slabTypeId !== id));
  }

  function addSlabMeasurement() {
    if (!newSlabMeas.mark.trim() || newSlabMeas.slabTypeId === 0 || newSlabMeas.length <= 0 || newSlabMeas.width <= 0 || newSlabMeas.quantity <= 0) return;
    const area = newSlabMeas.length * newSlabMeas.width * newSlabMeas.quantity;
    setSlabMeasurements((prev) => [...prev, { id: Date.now(), ...newSlabMeas, area }]);
    resetSlabMeas();
  }

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

      {/* PAD FOOTING MODULE UI (remaining in page.tsx) */}
      <div style={cardStyle}>
        <h1>Pad Footing Module</h1>
        <h2>Pad Footing Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newPadFooting.name} onChange={(e) => updatePadFooting({ name: e.target.value })} />
          <input type="number" placeholder="Pad Length mm" value={newPadFooting.padLength} onChange={(e) => updatePadFooting({ padLength: Number(e.target.value) })} />
          <input type="number" placeholder="Pad Width mm" value={newPadFooting.padWidth} onChange={(e) => updatePadFooting({ padWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Pad Depth mm" value={newPadFooting.padDepth} onChange={(e) => updatePadFooting({ padDepth: Number(e.target.value) })} />
          <input type="number" placeholder="Excavation Length mm" value={newPadFooting.excavationLength} onChange={(e) => updatePadFooting({ excavationLength: Number(e.target.value) })} />
          <input type="number" placeholder="Excavation Width mm" value={newPadFooting.excavationWidth} onChange={(e) => updatePadFooting({ excavationWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Excavation Depth mm" value={newPadFooting.excavationDepth} onChange={(e) => updatePadFooting({ excavationDepth: Number(e.target.value) })} />
          <button onClick={savePadFootingType}>{editingPadFootingId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Pad Size</th>
              <th style={thStyle}>Excavation</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {padFootingTypes.map((pf) => (
              <tr key={pf.id}>
                <td style={tdStyle}>{pf.name}</td>
                <td style={tdStyle}>{pf.padLength}x{pf.padWidth}x{pf.padDepth}</td>
                <td style={tdStyle}>{pf.excavationLength}x{pf.excavationWidth}x{pf.excavationDepth}</td>
                <td style={tdStyle}>
                  <button onClick={() => editPadFootingType(pf.id)}>Edit</button>
                  <button onClick={() => deletePadFootingType(pf.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h2>Pad Footing Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newPadFootingMeas.mark} onChange={(e) => updatePadFootingMeas({ mark: e.target.value })} />
          <select value={newPadFootingMeas.padFootingTypeId} onChange={(e) => updatePadFootingMeas({ padFootingTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {padFootingTypes.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Quantity" value={newPadFootingMeas.quantity} onChange={(e) => updatePadFootingMeas({ quantity: Number(e.target.value) })} />
          <button onClick={addPadFootingMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Pad Type</th>
              <th style={thStyle}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {padFootingMeasurements.map((m) => {
              const pf = padFootingTypes.find((p) => p.id === m.padFootingTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{pf?.name}</td>
                  <td style={tdStyle}>{m.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* GROUND BEAM MODULE UI */}
      <div style={cardStyle}>
        <h1>Ground Beam Module</h1>
        <h2>Ground Beam Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newGroundBeam.name} onChange={(e) => updateGroundBeam({ name: e.target.value })} />
          <input type="number" placeholder="Trench Width mm" value={newGroundBeam.trenchWidth} onChange={(e) => updateGroundBeam({ trenchWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Trench Depth mm" value={newGroundBeam.trenchDepth} onChange={(e) => updateGroundBeam({ trenchDepth: Number(e.target.value) })} />
          <input type="number" placeholder="Beam Width mm" value={newGroundBeam.beamWidth} onChange={(e) => updateGroundBeam({ beamWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Beam Depth mm" value={newGroundBeam.beamDepth} onChange={(e) => updateGroundBeam({ beamDepth: Number(e.target.value) })} />
          <button onClick={saveGroundBeamType}>{editingGroundBeamId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Trench</th>
              <th style={thStyle}>Beam</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groundBeamTypes.map((gb) => (
              <tr key={gb.id}>
                <td style={tdStyle}>{gb.name}</td>
                <td style={tdStyle}>{gb.trenchWidth}x{gb.trenchDepth}</td>
                <td style={tdStyle}>{gb.beamWidth}x{gb.beamDepth}</td>
                <td style={tdStyle}>
                  <button onClick={() => editGroundBeamType(gb.id)}>Edit</button>
                  <button onClick={() => deleteGroundBeamType(gb.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h2>Ground Beam Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newGroundBeamMeas.mark} onChange={(e) => updateGroundBeamMeas({ mark: e.target.value })} />
          <select value={newGroundBeamMeas.groundBeamTypeId} onChange={(e) => updateGroundBeamMeas({ groundBeamTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {groundBeamTypes.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Length (m)" value={newGroundBeamMeas.length} onChange={(e) => updateGroundBeamMeas({ length: Number(e.target.value) })} />
          <button onClick={addGroundBeamMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Ground Beam Type</th>
              <th style={thStyle}>Length</th>
            </tr>
          </thead>
          <tbody>
            {groundBeamMeasurements.map((m) => {
              const gb = groundBeamTypes.find((g) => g.id === m.groundBeamTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{gb?.name}</td>
                  <td style={tdStyle}>{m.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* COLUMN MODULE UI */}
      <div style={cardStyle}>
        <h1>Column Module</h1>
        <h2>Column Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newColumn.name} onChange={(e) => updateColumn({ name: e.target.value })} />
          <input type="number" placeholder="Width mm" value={newColumn.width} onChange={(e) => updateColumn({ width: Number(e.target.value) })} />
          <input type="number" placeholder="Depth mm" value={newColumn.depth} onChange={(e) => updateColumn({ depth: Number(e.target.value) })} />
          <input type="number" placeholder="Height mm" value={newColumn.height} onChange={(e) => updateColumn({ height: Number(e.target.value) })} />
          <button onClick={saveColumnType}>{editingColumnId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Width</th>
              <th style={thStyle}>Depth</th>
              <th style={thStyle}>Height</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {columnTypes.map((col) => (
              <tr key={col.id}>
                <td style={tdStyle}>{col.name}</td>
                <td style={tdStyle}>{col.width}mm</td>
                <td style={tdStyle}>{col.depth}mm</td>
                <td style={tdStyle}>{col.height}mm</td>
                <td style={tdStyle}>
                  <button onClick={() => editColumnType(col.id)}>Edit</button>
                  <button onClick={() => deleteColumnType(col.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h2>Column Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newColumnMeas.mark} onChange={(e) => updateColumnMeas({ mark: e.target.value })} />
          <select value={newColumnMeas.columnTypeId} onChange={(e) => updateColumnMeas({ columnTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {columnTypes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Quantity" value={newColumnMeas.quantity} onChange={(e) => updateColumnMeas({ quantity: Number(e.target.value) })} />
          <button onClick={addColumnMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Column Type</th>
              <th style={thStyle}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {columnMeasurements.map((m) => {
              const col = columnTypes.find((c) => c.id === m.columnTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{col?.name}</td>
                  <td style={tdStyle}>{m.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* WALL MODULE UI */}
      <div style={cardStyle}>
        <h1>Wall Module</h1>
        <h2>Wall Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newWall.name} onChange={(e) => updateWall({ name: e.target.value })} />
          
          <select value={newWall.brickType} onChange={(e) => handleBrickTypeChange(e.target.value as BrickType)}>
            <option>Common</option>
            <option>Imperial</option>
            <option>Maxi 90</option>
          </select>
          
          <select value={newWall.thicknessType} onChange={(e) => handleThicknessTypeChange(e.target.value as WallThicknessType)}>
            <option>Single Skin (Half Brick)</option>
            <option>Double Skin (One Brick)</option>
            <option>Cavity Wall</option>
            <option>Triple Skin</option>
          </select>
          
          <div style={{ padding: "8px", background: "#eef", borderRadius: "4px" }}>
            Thickness: {newWall.thicknessMm}mm
          </div>
          
          <label>
            <input type="checkbox" checked={newWall.plasterBothSides} onChange={(e) => updateWall({ plasterBothSides: e.target.checked })} /> 
            Plaster both sides
          </label>
          
          <label>
            <input type="checkbox" checked={newWall.paintRequired} onChange={(e) => updateWall({ paintRequired: e.target.checked })} /> 
            Paint required
          </label>
          
          <label>
            <input type="checkbox" checked={newWall.dpcRequired} onChange={(e) => updateWall({ dpcRequired: e.target.checked })} /> 
            DPC required
          </label>
          
          <label>
            <input type="checkbox" checked={newWall.reinforcementRequired} onChange={(e) => updateWall({ reinforcementRequired: e.target.checked })} /> 
            Bed joint reinforcement
          </label>
          
          {newWall.reinforcementRequired && (
            <input type="number" placeholder="Courses per layer" value={newWall.coursesPerReinforcement} onChange={(e) => updateWall({ coursesPerReinforcement: Number(e.target.value) })} />
          )}
          
          <label>
            <input type="checkbox" checked={newWall.tilesInternal} onChange={(e) => updateWall({ tilesInternal: e.target.checked })} /> 
            Tiles internal
          </label>
          
          {newWall.tilesInternal && (
            <input type="number" placeholder="PC sum internal (R/m²)" value={newWall.tilePcSumInternal} onChange={(e) => updateWall({ tilePcSumInternal: Number(e.target.value) })} />
          )}
          
          <label>
            <input type="checkbox" checked={newWall.tilesExternal} onChange={(e) => updateWall({ tilesExternal: e.target.checked })} /> 
            Tiles external
          </label>
          
          {newWall.tilesExternal && (
            <input type="number" placeholder="PC sum external (R/m²)" value={newWall.tilePcSumExternal} onChange={(e) => updateWall({ tilePcSumExternal: Number(e.target.value) })} />
          )}
          
          <button onClick={saveWallType}>{editingWallId !== null ? "Update" : "Save"}</button>
        </div>
        
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Brick Type</th>
              <th style={thStyle}>Wall Type</th>
              <th style={thStyle}>Thick</th>
              <th style={thStyle}>Plaster</th>
              <th style={thStyle}>Paint</th>
              <th style={thStyle}>DPC</th>
              <th style={thStyle}>Reinf</th>
              <th style={thStyle}>Int Tiles</th>
              <th style={thStyle}>Ext Tiles</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallTypes.map((wall) => (
              <tr key={wall.id}>
                <td style={tdStyle}>{wall.name}</td>
                <td style={tdStyle}>{wall.brickType}</td>
                <td style={tdStyle}>{wall.thicknessType}</td>
                <td style={tdStyle}>{wall.thicknessMm}mm</td>
                <td style={tdStyle}>{wall.plasterBothSides ? "Both" : "No"}</td>
                <td style={tdStyle}>{wall.paintRequired ? "Yes" : "No"}</td>
                <td style={tdStyle}>{wall.dpcRequired ? "Yes" : "No"}</td>
                <td style={tdStyle}>{wall.reinforcementRequired ? `${wall.coursesPerReinforcement}crs` : "No"}</td>
                <td style={tdStyle}>{wall.tilesInternal ? `R${wall.tilePcSumInternal}` : "No"}</td>
                <td style={tdStyle}>{wall.tilesExternal ? `R${wall.tilePcSumExternal}` : "No"}</td>
                <td style={tdStyle}>
                  <button onClick={() => editWallType(wall.id)}>Edit</button>
                  <button onClick={() => deleteWallType(wall.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <hr />
        <h2>Wall Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newWallMeas.mark} onChange={(e) => updateWallMeas({ mark: e.target.value })} />
          <select value={newWallMeas.wallTypeId} onChange={(e) => updateWallMeas({ wallTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {wallTypes.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Length (m)" value={newWallMeas.length} onChange={(e) => updateWallMeas({ length: Number(e.target.value) })} />
          <input type="number" placeholder="Height (m)" value={newWallMeas.height} onChange={(e) => updateWallMeas({ height: Number(e.target.value) })} />
          <button onClick={addWallMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Wall Type</th>
              <th style={thStyle}>Length</th>
              <th style={thStyle}>Height</th>
              <th style={thStyle}>Area (m²)</th>
            </tr>
          </thead>
          <tbody>
            {wallMeasurements.map((m) => {
              const wall = wallTypes.find((w) => w.id === m.wallTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{wall?.name}</td>
                  <td style={tdStyle}>{m.length}</td>
                  <td style={tdStyle}>{m.height}</td>
                  <td style={tdStyle}>{m.area}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SLAB MODULE UI */}
      <div style={cardStyle}>
        <h1>Suspended Slab Module</h1>
        <h2>Slab Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newSlab.name} onChange={(e) => updateSlab({ name: e.target.value })} />
          <input type="number" placeholder="Thickness mm" value={newSlab.thickness} onChange={(e) => updateSlab({ thickness: Number(e.target.value) })} />
          <select value={newSlab.concreteClass} onChange={(e) => updateSlab({ concreteClass: e.target.value })}>
            <option>25MPa/19mm</option>
            <option>30MPa/19mm</option>
            <option>35MPa/19mm</option>
          </select>
          <select value={newSlab.reinfType} onChange={(e) => updateSlab({ reinfType: e.target.value as "Mesh" | "Rebar" })}>
            <option>Rebar</option>
            <option>Mesh</option>
          </select>
          {newSlab.reinfType === "Rebar" && (
            <input type="number" placeholder="Reinf kg/m³" value={newSlab.reinfKgPerM3} onChange={(e) => updateSlab({ reinfKgPerM3: Number(e.target.value) })} />
          )}
          {newSlab.reinfType === "Mesh" && (
            <select value={newSlab.meshType} onChange={(e) => updateSlab({ meshType: e.target.value })}>
              <option>A193</option>
              <option>A252</option>
              <option>B196</option>
              <option>B283</option>
              <option>None</option>
            </select>
          )}
          <label>
            <input type="checkbox" checked={newSlab.formworkToEdges} onChange={(e) => updateSlab({ formworkToEdges: e.target.checked })} /> Formwork to edges
          </label>
          <label>
            <input type="checkbox" checked={newSlab.screedRequired} onChange={(e) => updateSlab({ screedRequired: e.target.checked })} /> Screed
          </label>
          {newSlab.screedRequired && (
            <input type="number" placeholder="Screed thickness mm" value={newSlab.screedThickness} onChange={(e) => updateSlab({ screedThickness: Number(e.target.value) })} />
          )}
          <input type="number" placeholder="Floor finish PC sum (R/m²)" value={newSlab.floorFinishPcSum} onChange={(e) => updateSlab({ floorFinishPcSum: Number(e.target.value) })} />
          <input placeholder="Finish description" value={newSlab.floorFinishDescription} onChange={(e) => updateSlab({ floorFinishDescription: e.target.value })} />
          <button onClick={saveSlabType}>{editingSlabId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Thick</th>
              <th style={thStyle}>Concrete</th>
              <th style={thStyle}>Reinf</th>
              <th style={thStyle}>Edges</th>
              <th style={thStyle}>Screed</th>
              <th style={thStyle}>Floor Finish</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slabTypes.map((slab) => (
              <tr key={slab.id}>
                <td style={tdStyle}>{slab.name}</td>
                <td style={tdStyle}>{slab.thickness}mm</td>
                <td style={tdStyle}>{slab.concreteClass}</td>
                <td style={tdStyle}>{slab.reinfType === "Rebar" ? `${slab.reinfKgPerM3} kg/m³` : slab.meshType}</td>
                <td style={tdStyle}>{slab.formworkToEdges ? "Yes" : "No"}</td>
                <td style={tdStyle}>{slab.screedRequired ? `${slab.screedThickness}mm` : "No"}</td>
                <td style={tdStyle}>{slab.floorFinishPcSum > 0 ? `${slab.floorFinishDescription} R${slab.floorFinishPcSum}/m²` : "None"}</td>
                <td style={tdStyle}>
                  <button onClick={() => editSlabType(slab.id)}>Edit</button>
                  <button onClick={() => deleteSlabType(slab.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h2>Slab Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newSlabMeas.mark} onChange={(e) => updateSlabMeas({ mark: e.target.value })} />
          <select value={newSlabMeas.slabTypeId} onChange={(e) => updateSlabMeas({ slabTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {slabTypes.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Length (m)" value={newSlabMeas.length} onChange={(e) => updateSlabMeas({ length: Number(e.target.value) })} />
          <input type="number" placeholder="Width (m)" value={newSlabMeas.width} onChange={(e) => updateSlabMeas({ width: Number(e.target.value) })} />
          <input type="number" placeholder="Quantity" value={newSlabMeas.quantity} onChange={(e) => updateSlabMeas({ quantity: Number(e.target.value) })} />
          <button onClick={addSlabMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Slab Type</th>
              <th style={thStyle}>Length</th>
              <th style={thStyle}>Width</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Area</th>
            </tr>
          </thead>
          <tbody>
            {slabMeasurements.map((m) => {
              const slab = slabTypes.find((s) => s.id === m.slabTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{slab?.name}</td>
                  <td style={tdStyle}>{m.length}</td>
                  <td style={tdStyle}>{m.width}</td>
                  <td style={tdStyle}>{m.quantity}</td>
                  <td style={tdStyle}>{m.area}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}