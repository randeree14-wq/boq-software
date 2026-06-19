"use client";

import { useEffect, useState } from "react";
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
  ProjectData,
} from "@/types/boq";
import {
  addToBoqItem,
  addLayerToBoq,
  addBoqItemFromBillKey,
  getBrickDefaults,
  getThicknessFromType,
} from "@/lib/boqHelpers";
import {
  saveProjectData,
  loadProjectData,
  clearProjectData,
} from "@/lib/projectStorage";
import { SECTIONS } from "@/lib/boqStructure";
import BoqSummary from "@/components/BoqSummary";

// Import all module components
import BeamModule from "@/components/BeamModule";
import SurfaceBedModule from "@/components/SurfaceBedModule";
import PadFootingModule from "@/components/PadFootingModule";
import GroundBeamModule from "@/components/GroundBeamModule";
import ColumnModule from "@/components/ColumnModule";
import WallModule from "@/components/WallModule";
import SlabModule from "@/components/SlabModule";

import OpeningsModule from "@/components/OpeningsModule";
import type {
  // ... existing ...
  OpeningType,
  OpeningMeasurement,
  DoorConfiguration,
  DoorLeafType,
  DoorFrameType,
  WindowType,
  WindowFrameType,
  WallThicknessOption,
} from "@/types/boq";

// ============================================
// Helper: Extract concrete strength
// ============================================
function getConcreteStrength(concreteClass: string): string {
  const parts = concreteClass.split('/');
  return parts[0]; // e.g., "25MPa"
}

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
  // ---------- BEAM ----------
  const [beamTypes, setBeamTypes] = useState<BeamType[]>([
    { 
        id: 1, 
        name: "Main Roof Beam", 
        width: 230, 
        depth: 400, 
        reinfKg: 120, 
        formworkFinish: "Smooth", 
        concreteClass: "25MPa/19mm",
        beamProfileType: "Downstand Beam",
        beamWidthMm: 230,
        downstandDepthMm: 400,
        upstandHeightMm: 0,
        slabThicknessMm: 0,
        proppingHeightBand: "Not exceeding 1.5m",
        customProppingHeightDescription: undefined, 
    },
  ]);
  const [editingBeamId, setEditingBeamId] = useState<number | null>(null);

  const { values: newBeam, update: updateBeam, reset: resetBeam } = useFormState({
      name: "", 
      width: 230, 
      depth: 400, 
      reinfKg: 120, 
      formworkFinish: "Smooth", 
      concreteClass: "25MPa/19mm",
      beamProfileType: "Downstand Beam",
      beamWidthMm: 230,
      downstandDepthMm: 400,
      upstandHeightMm: 0,
      slabThicknessMm: 0,
      proppingHeightBand: "Not exceeding 1.5m",
      customProppingHeightDescription: undefined,
  });
  const [beamMeasurements, setBeamMeasurements] = useState<BeamMeasurement[]>([]);
  const { values: newBeamMeas, update: updateBeamMeas, reset: resetBeamMeas } = useFormState({
    mark: "", beamTypeId: 0, length: 0,
  });

  // ---------- SURFACE BED ----------
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

  // ---------- PAD FOOTING ----------
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

  // ---------- GROUND BEAM ----------
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

  // ---------- COLUMN ----------
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

  // ---------- WALL ----------
  const [wallTypes, setWallTypes] = useState<WallType[]>([]);
  const [editingWallId, setEditingWallId] = useState<number | null>(null);
  const defaultWall: Omit<WallType, "id"> = {
    name: "", brickType: "Common", thicknessType: "Single Skin (Half Brick)", thicknessMm: 102,
    courseHeight: 75, plasterBothSides: true, plasterThickness: 13, paintRequired: true, dpcRequired: true,
    reinforcementRequired: false, coursesPerReinforcement: 4, reinforcementType: "Galvanised mesh",
    tilesInternal: false, tilesExternal: false, tilePcSumInternal: 0, tilePcSumExternal: 0,
  };
  const { values: newWall, update: updateWall, reset: resetWall } = useFormState(defaultWall);
  const [wallMeasurements, setWallMeasurements] = useState<WallMeasurement[]>([]);
  const { values: newWallMeas, update: updateWallMeas, reset: resetWallMeas } = useFormState({
    mark: "", wallTypeId: 0, length: 0, height: 0, area: 0,
  });

  // ---------- SLAB ----------
  const [slabTypes, setSlabTypes] = useState<SlabType[]>([]);
  const [editingSlabId, setEditingSlabId] = useState<number | null>(null);
  const defaultSlab: Omit<SlabType, "id"> = {
    name: "", thickness: 175, concreteClass: "30MPa/19mm", reinfType: "Rebar", reinfKgPerM3: 120,
    meshType: "A193", formworkToEdges: true, screedRequired: false, screedThickness: 50,
    floorFinishPcSum: 0, floorFinishDescription: "Tiles",
  };
  const { values: newSlab, update: updateSlab, reset: resetSlab } = useFormState(defaultSlab);
  const [slabMeasurements, setSlabMeasurements] = useState<SlabMeasurement[]>([]);
  const { values: newSlabMeas, update: updateSlabMeas, reset: resetSlabMeas } = useFormState({
    mark: "", slabTypeId: 0, length: 0, width: 0, quantity: 1, area: 0,
  });

  // ---------- OPENINGS ----------
const [openingTypes, setOpeningTypes] = useState<OpeningType[]>([]);
const [editingOpeningId, setEditingOpeningId] = useState<number | null>(null);
const defaultOpening: Omit<OpeningType, "id"> = {
  name: "",
  category: "Door",
  widthMm: 900,
  heightMm: 2100,
  quantity: 1,
  wallThicknessOption: "Half brick",
  wallThicknessMm: undefined,
  includeLintel: true,
  lintelBearingMm: 230,
  includeRevealPlaster: true,
   includeIronmongery: true, // or false, but set a default
  // Door defaults
  doorConfiguration: "Single",
  doorLeafType: "Hollow core timber door",
  doorFrameType: "Timber frame",
  paintDoor: false,
  paintFrame: false,
  includeIronmongery: false,
  includeThreshold: false,
  // Window defaults
  windowType: "Aluminium window",
  windowFrameType: "Aluminium",
  externalSill: false,
  internalSill: false,
};
const { values: newOpening, update: updateOpening, reset: resetOpening } = useFormState(defaultOpening);
const [openingMeasurements, setOpeningMeasurements] = useState<OpeningMeasurement[]>([]);
const { values: newOpeningMeas, update: updateOpeningMeas, reset: resetOpeningMeas } = useFormState({
  mark: "",
  openingTypeId: 0,
  quantity: 1,
  linkedWallId: undefined,
});

  // ============================================
  // MEASUREMENT EDITING STATES  <-- PUT IT HERE
  // ============================================
// ============================================
// MEASUREMENT EDITING STATES
// ============================================
const [editingBeamMeasurementId, setEditingBeamMeasurementId] = useState<number | null>(null);
const [editingSurfaceBedMeasurementId, setEditingSurfaceBedMeasurementId] = useState<number | null>(null);
const [editingPadFootingMeasurementId, setEditingPadFootingMeasurementId] = useState<number | null>(null);
const [editingGroundBeamMeasurementId, setEditingGroundBeamMeasurementId] = useState<number | null>(null);
const [editingColumnMeasurementId, setEditingColumnMeasurementId] = useState<number | null>(null);
const [editingWallMeasurementId, setEditingWallMeasurementId] = useState<number | null>(null);
const [editingSlabMeasurementId, setEditingSlabMeasurementId] = useState<number | null>(null);
const [editingOpeningMeasurementId, setEditingOpeningMeasurementId] = useState<number | null>(null);

  // ============================================
  // LOCAL STORAGE PERSISTENCE
  // ============================================

  // Load saved data on initial render
  useEffect(() => {
    const savedData = loadProjectData();
    if (savedData) {
      setBeamTypes(savedData.beamTypes);
      setBeamMeasurements(savedData.beamMeasurements);
      setSurfaceBedTypes(savedData.surfaceBedTypes);
      setSurfaceBedMeasurements(savedData.surfaceBedMeasurements);
      setPadFootingTypes(savedData.padFootingTypes);
      setPadFootingMeasurements(savedData.padFootingMeasurements);
      setGroundBeamTypes(savedData.groundBeamTypes);
      setGroundBeamMeasurements(savedData.groundBeamMeasurements);
      setColumnTypes(savedData.columnTypes);
      setColumnMeasurements(savedData.columnMeasurements);
      setWallTypes(savedData.wallTypes);
      setWallMeasurements(savedData.wallMeasurements);
      setSlabTypes(savedData.slabTypes);
      setSlabMeasurements(savedData.slabMeasurements);
      setOpeningTypes(savedData.openingTypes);
      setOpeningMeasurements(savedData.openingMeasurements);
    }
  }, []);

  // Save data whenever any state changes
  const saveAllData = () => {
    const data: ProjectData = {
      beamTypes,
      beamMeasurements,
      surfaceBedTypes,
      surfaceBedMeasurements,
      padFootingTypes,
      padFootingMeasurements,
      groundBeamTypes,
      groundBeamMeasurements,
      columnTypes,
      columnMeasurements,
      wallTypes,
      wallMeasurements,
      slabTypes,
      slabMeasurements,
      openingTypes,
      openingMeasurements,
    };
    saveProjectData(data);
  };

  // Save whenever any state changes
  useEffect(() => {
    saveAllData();
  }, [
    beamTypes,
    beamMeasurements,
    surfaceBedTypes,
    surfaceBedMeasurements,
    padFootingTypes,
    padFootingMeasurements,
    groundBeamTypes,
    groundBeamMeasurements,
    columnTypes,
    columnMeasurements,
    wallTypes,
    wallMeasurements,
    slabTypes,
    slabMeasurements,
  ]);

  // Function to clear saved data
  const handleClearProject = () => {
    if (confirm("Are you sure you want to clear all saved project data? This cannot be undone.")) {
      clearProjectData();
      // Reset all state to empty arrays
      setBeamTypes([]);
      setBeamMeasurements([]);
      setSurfaceBedTypes([]);
      setSurfaceBedMeasurements([]);
      setPadFootingTypes([]);
      setPadFootingMeasurements([]);
      setGroundBeamTypes([]);
      setGroundBeamMeasurements([]);
      setColumnTypes([]);
      setColumnMeasurements([]);
      setWallTypes([]);
      setWallMeasurements([]);
      setSlabTypes([]);
      setSlabMeasurements([]);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================
  // BEAM HANDLERS
  function saveBeamType() {
    if (!newBeam.name.trim()) return;
    if (editingBeamId !== null) {
      setBeamTypes((prev) => prev.map((b) => (b.id === editingBeamId ? { ...b, ...newBeam } : b)));
      setEditingBeamId(null);
    } else {
      setBeamTypes((prev) => [...prev, { id: Date.now(), ...newBeam }]);
    }
    resetBeam();
  }

  function editBeamType(id: number) {
    const beam = beamTypes.find((b) => b.id === id);
    if (beam) { updateBeam(beam); setEditingBeamId(id); }
  }

  function deleteBeamType(id: number) {
    setBeamTypes((prev) => prev.filter((b) => b.id !== id));
    setBeamMeasurements((prev) => prev.filter((m) => m.beamTypeId !== id));
  }

  function addBeamMeasurement() {
    if (!newBeamMeas.mark.trim() || newBeamMeas.beamTypeId === 0 || newBeamMeas.length <= 0) return;
    setBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newBeamMeas }]);
    resetBeamMeas();
  }

  // SURFACE BED HANDLERS
  function saveSurfaceBedType() {
    if (!newSurfaceBed.name.trim()) return;
    if (editingSurfaceBedId !== null) {
      setSurfaceBedTypes((prev) => prev.map((sb) => (sb.id === editingSurfaceBedId ? { ...sb, ...newSurfaceBed } : sb)));
      setEditingSurfaceBedId(null);
    } else {
      setSurfaceBedTypes((prev) => [...prev, { id: Date.now(), ...newSurfaceBed }]);
    }
    resetSurfaceBed();
  }

  function editSurfaceBedType(id: number) {
    const sb = surfaceBedTypes.find((s) => s.id === id);
    if (sb) { updateSurfaceBed(sb); setEditingSurfaceBedId(id); }
  }

  function deleteSurfaceBedType(id: number) {
    setSurfaceBedTypes((prev) => prev.filter((sb) => sb.id !== id));
    setSurfaceBedMeasurements((prev) => prev.filter((m) => m.surfaceBedTypeId !== id));
  }

  function addSurfaceBedMeasurement() {
    if (!newSurfaceBedMeas.mark.trim() || newSurfaceBedMeas.surfaceBedTypeId === 0 || newSurfaceBedMeas.area <= 0) return;
    setSurfaceBedMeasurements((prev) => [...prev, { id: Date.now(), ...newSurfaceBedMeas }]);
    resetSurfaceBedMeas();
  }

  // PAD FOOTING HANDLERS
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
    if (pf) { updatePadFooting(pf); setEditingPadFootingId(id); }
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

  // GROUND BEAM HANDLERS
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
    if (gb) { updateGroundBeam(gb); setEditingGroundBeamId(id); }
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

  // COLUMN HANDLERS
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
    if (col) { updateColumn(col); setEditingColumnId(id); }
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

  // WALL HANDLERS
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
    if (wall) { updateWall(wall); setEditingWallId(id); }
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

  // SLAB HANDLERS
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
    if (slab) { updateSlab(slab); setEditingSlabId(id); }
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
// OPENINGS HANDLERS
function saveOpeningType() {
  if (!newOpening.name.trim()) return;
  if (editingOpeningId !== null) {
    setOpeningTypes((prev) => prev.map((o) => (o.id === editingOpeningId ? { ...o, ...newOpening } : o)));
    setEditingOpeningId(null);
  } else {
    setOpeningTypes((prev) => [...prev, { id: Date.now(), ...newOpening }]);
  }
  resetOpening();
}

function editOpeningType(id: number) {
  const op = openingTypes.find((o) => o.id === id);
  if (op) {
    updateOpening(op);
    setEditingOpeningId(id);
  }
}

function deleteOpeningType(id: number) {
  setOpeningTypes((prev) => prev.filter((o) => o.id !== id));
  setOpeningMeasurements((prev) => prev.filter((m) => m.openingTypeId !== id));
}

function addOpeningMeasurement() {
  if (!newOpeningMeas.mark.trim() || newOpeningMeas.openingTypeId === 0 || newOpeningMeas.quantity <= 0) return;
  setOpeningMeasurements((prev) => [...prev, { id: Date.now(), ...newOpeningMeas }]);
  resetOpeningMeas();
}

  // ============================================
  // MASTER BOQ ENGINE
  // ============================================
  const masterBoqItems: Record<string, BoqItem> = {};

// ============================================
// BEAMS - COMPLETE PROFILE-BASED FORMWORK
// ============================================
beamMeasurements.forEach((m) => {
  const beam = beamTypes.find((b) => b.id === m.beamTypeId);
  if (!beam) return;
  
  // Use new dimension fields or fallback to old ones
  const beamWidth = beam.beamWidthMm || beam.width || 230;
  const downstandDepth = beam.downstandDepthMm || beam.depth || 400;
  const upstandHeight = beam.upstandHeightMm || 0;
  const slabThickness = beam.slabThicknessMm || 0;
  
  const beamWidthM = beamWidth / 1000;
  const downstandDepthM = downstandDepth / 1000;
  const upstandHeightM = upstandHeight / 1000;
  const slabThicknessM = slabThickness / 1000;
  
  // ============================================
  // CONCRETE CALCULATION
  // ============================================
  let concrete = 0;
  const profileType = beam.beamProfileType || "Downstand Beam";
  
  if (profileType === "Combined Downstand / Inverted Beam") {
    // Overall depth = Downstand + Slab + Inverted
    const overallDepth = downstandDepth + (slabThickness || 0) + upstandHeight;
    concrete = (beamWidth / 1000) * (overallDepth / 1000) * m.length;
  } else {
    // Standard calculation (unchanged for other profiles)
    concrete = beamWidthM * downstandDepthM * m.length;
  }
  
  const totalReinf = (concrete * beam.reinfKg) / 1000;
  const highTensile = totalReinf * 0.9;
  const mildSteel = totalReinf * 0.1;
  const strength = getConcreteStrength(beam.concreteClass);

  // CONCRETE
  let concreteDescription = `${beam.concreteClass} concrete in beams`;
  if (profileType === "Combined Downstand / Inverted Beam") {
    concreteDescription = `${beam.concreteClass} concrete in combined downstand / inverted beams`;
  }
  
  addBoqItemFromBillKey(
    masterBoqItems,
    "CONCRETE",
    `Concrete (${strength})`,
    concreteDescription,
    "m³",
    concrete
  );

  // REINFORCEMENT (unchanged)
  if (highTensile > 0) {
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      SECTIONS.REINFORCEMENT,
      "High tensile reinforcement",
      "t",
      highTensile
    );
  }
  if (mildSteel > 0) {
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      SECTIONS.REINFORCEMENT,
      "Mild steel reinforcement",
      "t",
      mildSteel
    );
  }

  // ============================================
  // FORMWORK - PROFILE-BASED CALCULATION
  // ============================================
  const finish = beam.formworkFinish || "Smooth";
  
  // Skip formwork for integrated beams
  if (profileType === "Integrated Beam / No Separate Beam Formwork") {
    return;
  }

  // Get propping height description
  let proppingHeightDesc = "";
  if (beam.proppingHeightBand === "Custom") {
    proppingHeightDesc = beam.customProppingHeightDescription || "custom height";
  } else {
    proppingHeightDesc = beam.proppingHeightBand || "Not exceeding 1.5m";
  }

  let formworkGirthMm = 0;
  let formworkDescription = "";

  // ============================================
  // COMBINED DOWNSTAND / INVERTED BEAM
  // ============================================
  if (profileType === "Combined Downstand / Inverted Beam") {
    const overallDepth = downstandDepth + (slabThickness || 0) + upstandHeight;
    
    // ============================================
    // ITEM 1: Outer exposed formwork
    // Girth = Overall Depth + Beam Width + Downstand Depth
    // ============================================
    const outerGirth = overallDepth + beamWidth + downstandDepth;
    const outerArea = (outerGirth / 1000) * m.length;
    
    if (outerArea > 0) {
      const outerDescription = `${finish} formwork to sides and soffits of combined downstand / inverted beams, propped up ${proppingHeightDesc} high`;
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        outerDescription,
        "m²",
        outerArea
      );
    }
    
    // ============================================
    // ITEM 2: Internal face of inverted beam only
    // ============================================
    if (upstandHeight > 0) {
      if (upstandHeight <= 300) {
        // Formwork to edges, risers, ends and reveals not exceeding 300mm
        const item2Description = `${finish} formwork to edges, risers, ends and reveals of inverted beams, propped up ${proppingHeightDesc} high`;
        addBoqItemFromBillKey(
          masterBoqItems,
          "CONCRETE",
          SECTIONS.FORMWORK,
          item2Description,
          "m",
          m.length
        );
      } else {
        // Formwork to sides of inverted beams
        const invertedArea = (upstandHeight / 1000) * m.length;
        const item2Description = `${finish} formwork to sides of inverted beams, propped up ${proppingHeightDesc} high`;
        addBoqItemFromBillKey(
          masterBoqItems,
          "CONCRETE",
          SECTIONS.FORMWORK,
          item2Description,
          "m²",
          invertedArea
        );
      }
    }
    
    // Skip standard formwork calculation for combined beams
    return;
  }

  // ============================================
  // STANDARD PROFILES (Downstand, Upstand, Perimeter)
  // ============================================
  switch (profileType) {
    case "Downstand Beam":
      formworkGirthMm = (2 * downstandDepth) + beamWidth;
      formworkDescription = `${finish} formwork to sides and soffits of downstand beams, propped up ${proppingHeightDesc} high`;
      break;

    case "Upstand Beam":
      formworkGirthMm = 2 * upstandHeight;
      formworkDescription = `${finish} formwork to sides of upstand beams, propped up ${proppingHeightDesc} high`;
      break;

    case "Perimeter Beam (Downstand Only)":
      formworkGirthMm = (2 * downstandDepth) + beamWidth;
      formworkDescription = `${finish} formwork to sides and soffits of perimeter beams, propped up ${proppingHeightDesc} high`;
      break;

    case "Perimeter Beam (Downstand + Upstand)":
      formworkGirthMm = (2 * downstandDepth) + beamWidth + upstandHeight;
      formworkDescription = `${finish} formwork to sides and soffits of perimeter beams with upstand, propped up ${proppingHeightDesc} high`;
      break;

    default:
      formworkGirthMm = (2 * downstandDepth) + beamWidth;
      formworkDescription = `${finish} formwork to beams, propped up ${proppingHeightDesc} high`;
  }

  const formworkArea = (formworkGirthMm / 1000) * m.length;

  if (formworkArea > 0) {
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      SECTIONS.FORMWORK,
      formworkDescription,
      "m²",
      formworkArea
    );
  }
});
  // SURFACE BEDS
  surfaceBedMeasurements.forEach((m) => {
    const sb = surfaceBedTypes.find((s) => s.id === m.surfaceBedTypeId);
    if (!sb) return;
    
    const concreteVol = m.area * (sb.thickness / 1000);
    const strength = getConcreteStrength(sb.concreteClass);

    // Layer 1
    if (sb.layer1Material && sb.layer1Thickness > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.LAYERWORKS,
        `${sb.layer1Thickness}mm ${sb.layer1Material} compacted`,
        "m²",
        m.area
      );
    }
    // Layer 2
    if (sb.layer2Material && sb.layer2Thickness > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.LAYERWORKS,
        `${sb.layer2Thickness}mm ${sb.layer2Material} compacted`,
        "m²",
        m.area
      );
    }
    // Layer 3
    if (sb.layer3Material && sb.layer3Thickness > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.LAYERWORKS,
        `${sb.layer3Thickness}mm ${sb.layer3Material} compacted`,
        "m²",
        m.area
      );
    }

    // DPM
    if (sb.dpm) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "WATERPROOFING",
        SECTIONS.DPM,
        "DPM under surface beds",
        "m²",
        m.area
      );
    }

    // Soil Poisoning
    if (sb.soilPoison) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.SOIL_POISONING,
        "Soil poisoning under surface beds",
        "m²",
        m.area
      );
    }

    // Mesh Reinforcement – Fabric reinforcement
    if (sb.meshType !== "None") {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Fabric reinforcement",
        "m²",
        m.area
      );
    }

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${sb.concreteClass} concrete in surface beds`,
      "m³",
      concreteVol
    );

    // Screed
    if (sb.screedRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.SCREEDS,
        `${sb.screedThickness}mm screed ${sb.screedType}`,
        "m²",
        m.area
      );
    }

    // Tiles
    if (sb.tileRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "TILING",
        SECTIONS.TILING,
        `Tiles PC Sum R${sb.tilePcSum}/m²`,
        "m²",
        m.area
      );
    }

    // Powerfloat
    if (sb.powerfloat) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.FLOOR_FINISHES,
        "Powerfloat finish",
        "m²",
        m.area
      );
    }
  });

  // PAD FOOTINGS
  padFootingMeasurements.forEach((m) => {
    const pf = padFootingTypes.find((p) => p.id === m.padFootingTypeId);
    if (!pf) return;
    
    const qty = m.quantity;
    const padConcrete = (pf.padLength / 1000) * (pf.padWidth / 1000) * (pf.padDepth / 1000) * qty;
    const excavationVol = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * (pf.excavationDepth / 1000) * qty;
    const totalReinf = (padConcrete * pf.reinfKg) / 1000;
    const highTensile = totalReinf * 0.9;
    const mildSteel = totalReinf * 0.1;
    const strength = getConcreteStrength(pf.concreteClass);

    // Excavation
    addBoqItemFromBillKey(
      masterBoqItems,
      "EARTHWORKS",
      SECTIONS.EXCAVATION,
      "Excavation for pad footings",
      "m³",
      excavationVol
    );

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${pf.concreteClass} concrete in pad footings`,
      "m³",
      padConcrete
    );

    // Reinforcement – High Tensile
    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile
      );
    }

    // Reinforcement – Mild Steel
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel
      );
    }

    // Formwork
    if (pf.formworkRequired) {
      const formwork = 2 * ((pf.padLength / 1000) + (pf.padWidth / 1000)) * (pf.padDepth / 1000) * qty;
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        "Formwork to sides of pad footings",
        "m²",
        formwork
      );
    }

    // Blinding
    if (pf.blindingRequired) {
      const blinding = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * (pf.blindingThickness / 1000) * qty;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BLINDING,
        `${pf.blindingThickness}mm blinding under pad footings`,
        "m³",
        blinding
      );
    }

    // Soil Poisoning
    if (pf.soilPoison) {
      const soilPoisonArea = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * qty;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.SOIL_POISONING,
        "Soil poisoning to pad footings",
        "m²",
        soilPoisonArea
      );
    }

    // Backfill
    if (pf.backfill) {
      const backfillVol = excavationVol - padConcrete;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BACKFILLING,
        "Backfill to pad footings",
        "m³",
        backfillVol
      );
    }
  });

  // GROUND BEAMS
  groundBeamMeasurements.forEach((m) => {
    const gb = groundBeamTypes.find((g) => g.id === m.groundBeamTypeId);
    if (!gb) return;
    
    const length = m.length;
    const trenchVol = (gb.trenchWidth / 1000) * (gb.trenchDepth / 1000) * length;
    const concreteVol = (gb.beamWidth / 1000) * (gb.beamDepth / 1000) * length;
    const totalReinf = (concreteVol * gb.reinfKgPerM3) / 1000;
    const highTensile = totalReinf * 0.9;
    const mildSteel = totalReinf * 0.1;
    const strength = getConcreteStrength(gb.concreteClass);

    // Excavation
    addBoqItemFromBillKey(
      masterBoqItems,
      "EARTHWORKS",
      SECTIONS.EXCAVATION,
      "Excavation for ground beams",
      "m³",
      trenchVol
    );

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${gb.concreteClass} concrete in ground beams`,
      "m³",
      concreteVol
    );

    // Reinforcement – High Tensile
    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile
      );
    }

    // Reinforcement – Mild Steel
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel
      );
    }

    // Formwork
    if (gb.formworkRequired) {
      const formwork = (gb.beamDepth / 1000) * length * 2;
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        "Formwork to sides of ground beams",
        "m²",
        formwork
      );
    }

    // Blinding
    if (gb.blindingRequired) {
      const blindingVol = (gb.beamWidth / 1000) * (gb.blindingThickness / 1000) * length;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BLINDING,
        `${gb.blindingThickness}mm blinding under ground beams`,
        "m³",
        blindingVol
      );
    }

    // Backfill
    if (gb.backfillRequired) {
      const backfillVol = trenchVol - concreteVol;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BACKFILLING,
        "Backfill to ground beams",
        "m³",
        backfillVol
      );
    }

    // DPC
    if (gb.dpcRequired) {
      const dpcArea = (gb.beamWidth / 1000) * length;
      addBoqItemFromBillKey(
        masterBoqItems,
        "MASONRY",
        SECTIONS.DAMP_PROOF_COURSES,
        "DPC to ground beams",
        "m²",
        dpcArea
      );
    }

    // Soil Poisoning
    if (gb.soilPoisonRequired) {
      const soilPoisonArea = (gb.trenchWidth / 1000) * length;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.SOIL_POISONING,
        "Soil poisoning under ground beams",
        "m²",
        soilPoisonArea
      );
    }
  });

  // COLUMNS
  columnMeasurements.forEach((m) => {
    const col = columnTypes.find((c) => c.id === m.columnTypeId);
    if (!col) return;
    
    const qty = m.quantity;
    const concreteVol = (col.width / 1000) * (col.depth / 1000) * (col.height / 1000) * qty;
    const totalReinf = (concreteVol * col.reinfKgPerM3) / 1000;
    const highTensile = totalReinf * 0.9;
    const mildSteel = totalReinf * 0.1;
    const strength = getConcreteStrength(col.concreteClass);

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${col.concreteClass} concrete in columns`,
      "m³",
      concreteVol
    );

    // Reinforcement – High Tensile
    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile
      );
    }

    // Reinforcement – Mild Steel
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel
      );
    }

    // Formwork
    if (col.formworkRequired) {
      const perimeter = 2 * ((col.width / 1000) + (col.depth / 1000));
      const formworkArea = perimeter * (col.height / 1000) * qty;
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        `${col.formworkFinish} formwork to sides of columns`,
        "m²",
        formworkArea
      );
    }
  });

  // WALLS
  wallMeasurements.forEach((m) => {
    const wall = wallTypes.find((w) => w.id === m.wallTypeId);
    if (!wall) return;
    
    const area = m.area;

    // Brickwork
    addBoqItemFromBillKey(
      masterBoqItems,
      "MASONRY",
      SECTIONS.BRICKWORK,
      `${wall.brickType} brickwork - ${wall.thicknessType}`,
      "m²",
      area
    );

    // Plaster
    if (wall.plasterBothSides) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "PLASTERING",
        SECTIONS.PLASTER,
        `Plaster to walls (both sides) - ${wall.thicknessType}`,
        "m²",
        area * 2
      );
    }

    // Paint
    if (wall.paintRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "PAINTWORK",
        SECTIONS.PAINT,
        "Paint to walls",
        "m²",
        area * 2
      );
    }

    // DPC
    if (wall.dpcRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "MASONRY",
        SECTIONS.DAMP_PROOF_COURSES,
        "Damp-proof course",
        "m",
        m.length
      );
    }

    // Bed joint reinforcement
    if (wall.reinforcementRequired) {
      const numberOfLayers = Math.floor((m.height * 1000) / (wall.courseHeight * wall.coursesPerReinforcement));
      addBoqItemFromBillKey(
        masterBoqItems,
        "MASONRY",
        SECTIONS.MASONRY_REINFORCEMENT,
        `Bed joint reinforcement (${wall.reinforcementType})`,
        "m",
        m.length * numberOfLayers
      );
    }

    // Tiles Internal
    if (wall.tilesInternal) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "TILING",
        SECTIONS.TILING,
        `Wall tiles internal - PC Sum R${wall.tilePcSumInternal}/m²`,
        "m²",
        area
      );
    }

    // Tiles External
    if (wall.tilesExternal) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "TILING",
        SECTIONS.TILING,
        `Wall tiles external - PC Sum R${wall.tilePcSumExternal}/m²`,
        "m²",
        area
      );
    }
  });

  // SLABS
  slabMeasurements.forEach((m) => {
    const slab = slabTypes.find((s) => s.id === m.slabTypeId);
    if (!slab) return;
    
    const area = m.area;
    const concreteVol = area * (slab.thickness / 1000);
    const strength = getConcreteStrength(slab.concreteClass);

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${slab.concreteClass} concrete in suspended slab`,
      "m³",
      concreteVol
    );

    // Reinforcement – Rebar
    if (slab.reinfType === "Rebar") {
      const totalReinf = (concreteVol * slab.reinfKgPerM3) / 1000;
      const highTensile = totalReinf * 0.9;
      const mildSteel = totalReinf * 0.1;

      if (highTensile > 0) {
        addBoqItemFromBillKey(
          masterBoqItems,
          "CONCRETE",
          SECTIONS.REINFORCEMENT,
          "High tensile reinforcement",
          "t",
          highTensile
        );
      }
      if (mildSteel > 0) {
        addBoqItemFromBillKey(
          masterBoqItems,
          "CONCRETE",
          SECTIONS.REINFORCEMENT,
          "Mild steel reinforcement",
          "t",
          mildSteel
        );
      }
    } 
    // Reinforcement – Mesh
    else if (slab.reinfType === "Mesh" && slab.meshType && slab.meshType !== "None") {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Fabric reinforcement",
        "m²",
        area
      );
    }

    // Formwork to edges
    if (slab.formworkToEdges) {
      const perimeter = 2 * (m.length + m.width) * m.quantity;
      const formworkArea = perimeter * (slab.thickness / 1000);
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        "Formwork to edges of slabs",
        "m²",
        formworkArea
      );
    }

    // Screed
    if (slab.screedRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.SCREEDS,
        `${slab.screedThickness}mm screed to slab`,
        "m²",
        area
      );
    }

    // Floor finish PC sum
    if (slab.floorFinishPcSum > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.FLOOR_FINISHES,
        `${slab.floorFinishDescription} floor finish PC R${slab.floorFinishPcSum}/m²`,
        "m²",
        area
      );
    }
  });
// ============================================
// OPENINGS
// ============================================
openingMeasurements.forEach((m) => {
  const op = openingTypes.find((o) => o.id === m.openingTypeId);
  if (!op) return;

  const qty = m.quantity;
  const width = op.widthMm / 1000; // m
  const height = op.heightMm / 1000; // m
  const perimeter = 2 * height + width; // m
  const wallThickness = op.wallThicknessOption === "Half brick" ? 0.102
                     : op.wallThicknessOption === "One brick" ? 0.215
                     : (op.wallThicknessMm || 0) / 1000;

  const addItem = (billKey: string, section: string, description: string, unit: string, qtyVal: number) => {
    if (qtyVal > 0) {
      addBoqItemFromBillKey(masterBoqItems, billKey, section, description, unit, qtyVal);
    }
  };

  // 1. Lintel (if included)
   if (op.includeLintel) {
    const lintelLength = (op.widthMm + 2 * op.lintelBearingMm) / 1000; // m
    let lengthCategory = "";
    if (lintelLength <= 3.0) {
      lengthCategory = "not exceeding 3.0m";
    } else if (lintelLength <= 4.5) {
      lengthCategory = "exceeding 3.0m but not exceeding 4.5m";
    } else if (lintelLength <= 6.0) {
      lengthCategory = "exceeding 4.5m but not exceeding 6.0m";
    } else if (lintelLength <= 7.5) {
      lengthCategory = "exceeding 6.0m but not exceeding 7.5m";
    } else {
      lengthCategory = "exceeding 7.5m";
    }
    const lintelDesc = `Prestressed concrete lintel ${lengthCategory} over openings`;
    addItem("MASONRY", SECTIONS.LINTELS, lintelDesc, "m", lintelLength * qty);
  }
  // 2. Reveal plaster & paint to narrow widths (if included)
  if (op.includeRevealPlaster && wallThickness > 0) {
    const narrowArea = perimeter * wallThickness; // m²

    const plasterDesc = `Plaster to narrow widths around ${op.category.toLowerCase()} openings`;
    addItem("PLASTERING", SECTIONS.NARROW_WIDTHS, plasterDesc, "m²", narrowArea * qty);

    const paintDesc = `Paint to narrow widths around ${op.category.toLowerCase()} openings`;
    addItem("PAINTWORK", SECTIONS.NARROW_WIDTHS, paintDesc, "m²", narrowArea * qty);
  }

  // 3. Door-specific items
  if (op.category === "Door") {
    const doorConfig = op.doorConfiguration || "Single";
    const leafType = op.doorLeafType || "Hollow core timber door";
    const frameType = op.doorFrameType || "Timber frame";
    const doorWidth = op.widthMm;
    const doorHeight = op.heightMm;

    // Door leaf
        let leafBillKey: string;
    if (leafType.includes("Aluminium") || leafType.includes("Steel")) {
      leafBillKey = "METALWORK";
    } else {
      leafBillKey = "CARPENTRY";
    }
    const leafDesc = `${doorConfig} ${leafType} ${doorWidth} x ${doorHeight}mm high`;
    addItem(leafBillKey, SECTIONS.DOORS, leafDesc, "No", qty);

    // Frame
        let frameBillKey: string;
    if (frameType === "Timber frame") {
      frameBillKey = "CARPENTRY";
    } else {
      frameBillKey = "METALWORK";
    }
    let frameLength = 2 * doorHeight + doorWidth; // mm
    if (op.includeThreshold) {
      frameLength += doorWidth;
    }
    const frameLengthM = frameLength / 1000;
    const frameDesc = `${frameType} for ${doorConfig} door`;
    addItem(frameBillKey, SECTIONS.FRAMES, frameDesc, "m", frameLengthM * qty);

    // Ironmongery – Standard ironmongery set
    if (op.includeIronmongery) {
      addItem("IRONMONGERY", SECTIONS.IRONMONGERY, "Standard ironmongery set", "No", qty);
    }

    // Painting
    if (op.paintDoor) {
      const paintArea = (doorWidth / 1000) * (doorHeight / 1000) * 2; // two faces
      addItem("PAINTWORK", SECTIONS.PAINT, `Paint to doors`, "m²", paintArea * qty);
    }
    if (op.paintFrame) {
      const framePaintArea = frameLengthM * 0.1; // 0.1m width approximation
      addItem("PAINTWORK", SECTIONS.PAINT, `Paint to door frames`, "m²", framePaintArea * qty);
    }
  
    // Ironmongery – we could add a PC sum item, but for now skip as it's complex.
    // Threshold – could add a separate item, but we already added length in frame.

    // Additional: if threshold is included and is a separate item, we could add it here.
    if (op.includeThreshold) {
      // For now, we just add it as part of frame length. If you want a separate item, uncomment:
      // addItem("METALWORK", "Thresholds", "Threshold for door", "m", (doorWidth/1000) * qty);
    }
  }

  // 4. Window-specific items
 if (op.category === "Window") {
    const windowType = op.windowType || "Aluminium window";
    const frameType = op.windowFrameType || "Aluminium";
    const windowWidth = op.widthMm;
    const windowHeight = op.heightMm;

    // Window unit
    let windowBillKey: string;
    if (windowType.includes("Aluminium") || windowType.includes("Steel")) {
      windowBillKey = "METALWORK";
    } else {
      windowBillKey = "CARPENTRY";
    }
    const windowDesc = `${windowType} ${windowWidth} x ${windowHeight}mm high`;
    addItem(windowBillKey, SECTIONS.WINDOWS, windowDesc, "No", qty);

    // External sill
 if (op.externalSill) {
      const sillLength = windowWidth / 1000;
      addItem("MASONRY", SECTIONS.SILLS, "External sill to window openings", "m", sillLength * qty);
    }

    // Internal sill
     if (op.internalSill) {
      const sillLength = windowWidth / 1000;
      addItem("CARPENTRY", SECTIONS.SILLS, "Internal sill to window openings", "m", sillLength * qty);
    }

    // Paint frame
 if (op.paintFrame) {
      const framePerimeter = 2 * (windowWidth + windowHeight) / 1000; // m
      const framePaintArea = framePerimeter * 0.1;
      addItem("PAINTWORK", SECTIONS.PAINT, "Paint to window frames", "m²", framePaintArea * qty);
    }
  }
});
  // ============================================
  // RENDER
  // ============================================
  return (
    <main style={pageStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>BOQ Measurement Software</h1>
        <button 
          onClick={handleClearProject}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Clear Saved Project
        </button>
      </div>

      {/* BOQ SUMMARY */}
      <h2>Generated BOQ Summary</h2>
      <BoqSummary boqItems={masterBoqItems} styles={styles} />

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
        editingBeamMeasurementId={editingBeamMeasurementId}
        setEditingBeamMeasurementId={setEditingBeamMeasurementId}
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
        editingSurfaceBedMeasurementId={editingSurfaceBedMeasurementId}
        setEditingSurfaceBedMeasurementId={setEditingSurfaceBedMeasurementId}
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
        editingPadFootingMeasurementId={editingPadFootingMeasurementId}
        setEditingPadFootingMeasurementId={setEditingPadFootingMeasurementId}
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
        editingGroundBeamMeasurementId={editingGroundBeamMeasurementId}
        setEditingGroundBeamMeasurementId={setEditingGroundBeamMeasurementId}
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
        editingColumnMeasurementId={editingColumnMeasurementId}
        setEditingColumnMeasurementId={setEditingColumnMeasurementId}
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
        editingWallMeasurementId={editingWallMeasurementId}
        setEditingWallMeasurementId={setEditingWallMeasurementId}
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
        editingSlabMeasurementId={editingSlabMeasurementId}
        setEditingSlabMeasurementId={setEditingSlabMeasurementId}
        styles={styles}
      />

      {/* OPENINGS MODULE */}
      <OpeningsModule
        openingTypes={openingTypes}
        setOpeningTypes={setOpeningTypes}
        editingOpeningId={editingOpeningId}
        setEditingOpeningId={setEditingOpeningId}
        newOpening={newOpening}
        updateOpening={updateOpening}
        resetOpening={resetOpening}
        openingMeasurements={openingMeasurements}
        setOpeningMeasurements={setOpeningMeasurements}
        newOpeningMeas={newOpeningMeas}
        updateOpeningMeas={updateOpeningMeas}
        resetOpeningMeas={resetOpeningMeas}
        styles={styles}
        editingOpeningMeasurementId={editingOpeningMeasurementId}
        setEditingOpeningMeasurementId={setEditingOpeningMeasurementId}
      />

    </main>
  );
}