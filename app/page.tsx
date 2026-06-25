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
  OpeningType,
  OpeningMeasurement,
  CostPlanComponent,
  WallLocation,
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
import { getElementalLocation } from "@/lib/elementalStructure";
import { exportBOQToExcel } from "@/lib/exportHelpers";
import { generateWallCostComponents } from "@/lib/costComponentGenerator";

// Layout components
import BoqSummary from "@/components/modules/BoqSummary";
import Dashboard from "@/components/dashboard/Dashboard";
import ElementalMeasurement from "@/components/elements/ElementalMeasurement";
import ElementalSummary from "@/components/elements/ElementalSummary";
import ElementalCostSummary from "@/components/elements/ElementalCostSummary";

// Module components
import BeamModule from "@/components/modules/BeamModule";
import SurfaceBedModule from "@/components/modules/SurfaceBedModule";
import PadFootingModule from "@/components/modules/PadFootingModule";
import GroundBeamModule from "@/components/modules/GroundBeamModule";
import ColumnModule from "@/components/modules/ColumnModule";
import WallModule from "@/components/modules/WallModule";
import SlabModule from "@/components/modules/SlabModule";
import OpeningsModule from "@/components/modules/OpeningsModule";

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
  const [beamTypes, setBeamTypes] = useState<BeamType[]>([]);
  const [editingBeamId, setEditingBeamId] = useState<number | null>(null);
  const { values: newBeam, update: updateBeam, reset: resetBeam } = useFormState({
    name: "",
    width: undefined,
    depth: undefined,
    reinfKg: undefined,
    formworkFinish: "Smooth",
    concreteClass: "25MPa/19mm",
    beamProfileType: "Downstand Beam",
    beamWidthMm: undefined,
    downstandDepthMm: undefined,
    upstandHeightMm: undefined,
    slabThicknessMm: undefined,
    proppingHeightBand: "Not exceeding 1.5m",
    customProppingHeightDescription: undefined,
  });
  const [beamMeasurements, setBeamMeasurements] = useState<BeamMeasurement[]>([]);
  const { values: newBeamMeas, update: updateBeamMeas, reset: resetBeamMeas } = useFormState({
    mark: "",
    beamTypeId: 0,
    length: undefined,
  });

  // ---------- SURFACE BED ----------
  const [surfaceBedTypes, setSurfaceBedTypes] = useState<SurfaceBedType[]>([]);
  const [editingSurfaceBedId, setEditingSurfaceBedId] = useState<number | null>(null);
  const { values: newSurfaceBed, update: updateSurfaceBed, reset: resetSurfaceBed } = useFormState({
    name: "",
    category: "Internal",
    thickness: undefined,
    concreteClass: "35MPa/19mm",
    meshType: "Ref193",
    dpm: true,
    soilPoison: true,
    layer1Material: "",
    layer1Thickness: undefined,
    layer2Material: "",
    layer2Thickness: undefined,
    layer3Material: "",
    layer3Thickness: undefined,
    powerfloat: true,
    screedRequired: false,
    screedThickness: undefined,
    screedType: "Normal",
    tileRequired: false,
    tilePcSum: undefined,
  });
  const [surfaceBedMeasurements, setSurfaceBedMeasurements] = useState<SurfaceBedMeasurement[]>([]);
  const { values: newSurfaceBedMeas, update: updateSurfaceBedMeas, reset: resetSurfaceBedMeas } = useFormState({
    mark: "",
    surfaceBedTypeId: 0,
    area: undefined,
  });

  // ---------- PAD FOOTING ----------
  const [padFootingTypes, setPadFootingTypes] = useState<PadFootingType[]>([]);
  const [editingPadFootingId, setEditingPadFootingId] = useState<number | null>(null);
  const { values: newPadFooting, update: updatePadFooting, reset: resetPadFooting } = useFormState({
    name: "",
    padLength: undefined,
    padWidth: undefined,
    padDepth: undefined,
    excavationLength: undefined,
    excavationWidth: undefined,
    excavationDepth: undefined,
    concreteClass: "30MPa/19mm",
    reinfKg: undefined,
    formworkRequired: true,
    blindingRequired: true,
    blindingThickness: undefined,
    soilPoison: false,
    backfill: true,
    workingSpaceRequired: false,
    riskOfCollapseRequired: false,
  });
  const [padFootingMeasurements, setPadFootingMeasurements] = useState<PadFootingMeasurement[]>([]);
  const { values: newPadFootingMeas, update: updatePadFootingMeas, reset: resetPadFootingMeas } = useFormState({
    mark: "",
    padFootingTypeId: 0,
    quantity: undefined,
  });

  // ---------- GROUND BEAM ----------
  const [groundBeamTypes, setGroundBeamTypes] = useState<GroundBeamType[]>([]);
  const [editingGroundBeamId, setEditingGroundBeamId] = useState<number | null>(null);
  const { values: newGroundBeam, update: updateGroundBeam, reset: resetGroundBeam } = useFormState({
    name: "",
    trenchWidth: undefined,
    trenchDepth: undefined,
    beamWidth: undefined,
    beamDepth: undefined,
    concreteClass: "30MPa/19mm",
    reinfKgPerM3: undefined,
    formworkRequired: true,
    blindingRequired: true,
    blindingThickness: undefined,
    backfillRequired: true,
    dpcRequired: false,
    soilPoisonRequired: false,
    workingSpaceRequired: false,
    riskOfCollapseRequired: false,
  });
  const [groundBeamMeasurements, setGroundBeamMeasurements] = useState<GroundBeamMeasurement[]>([]);
  const { values: newGroundBeamMeas, update: updateGroundBeamMeas, reset: resetGroundBeamMeas } = useFormState({
    mark: "",
    groundBeamTypeId: 0,
    length: undefined,
  });

  // ---------- COLUMN ----------
  const [columnTypes, setColumnTypes] = useState<ColumnType[]>([]);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const { values: newColumn, update: updateColumn, reset: resetColumn } = useFormState({
    name: "",
    width: undefined,
    depth: undefined,
    height: undefined,
    concreteClass: "35MPa/19mm",
    reinfKgPerM3: undefined,
    formworkRequired: true,
    formworkFinish: "Smooth",
  });
  const [columnMeasurements, setColumnMeasurements] = useState<ColumnMeasurement[]>([]);
  const { values: newColumnMeas, update: updateColumnMeas, reset: resetColumnMeas } = useFormState({
    mark: "",
    columnTypeId: 0,
    quantity: undefined,
  });

  // ---------- WALL ----------
  const [wallTypes, setWallTypes] = useState<WallType[]>([]);
  const [editingWallId, setEditingWallId] = useState<number | null>(null);
  const { values: newWall, update: updateWall, reset: resetWall } = useFormState({
    name: "",
    brickType: "Common",
    thicknessType: "Single Skin (Half Brick)",
    thicknessMm: undefined,
    courseHeight: 75,
    side1Plaster: true,
    side1Finish: "Paint",
    side1TilePcSum: undefined,
    side2Plaster: true,
    side2Finish: "Paint",
    side2TilePcSum: undefined,
    dpcRequired: true,
    reinforcementRequired: false,
    coursesPerReinforcement: 4,
    reinforcementType: "Galvanised mesh",
  });

  const [wallMeasurements, setWallMeasurements] = useState<WallMeasurement[]>([]);
  const { values: newWallMeas, update: updateWallMeas, reset: resetWallMeas } = useFormState({
    mark: "",
    wallTypeId: 0,
    length: undefined,
    height: undefined,
    area: undefined,
    wallLocation: "Internal Division",
  });

  // ---------- SLAB ----------
  const [slabTypes, setSlabTypes] = useState<SlabType[]>([]);
  const [editingSlabId, setEditingSlabId] = useState<number | null>(null);
  const { values: newSlab, update: updateSlab, reset: resetSlab } = useFormState({
    name: "",
    thickness: undefined,
    concreteClass: "30MPa/19mm",
    reinfType: "Rebar",
    reinfKgPerM3: undefined,
    meshType: "A193",
    formworkToEdges: true,
    screedRequired: false,
    screedThickness: undefined,
    floorFinishPcSum: undefined,
    floorFinishDescription: "Tiles",
  });
  const [slabMeasurements, setSlabMeasurements] = useState<SlabMeasurement[]>([]);
  const { values: newSlabMeas, update: updateSlabMeas, reset: resetSlabMeas } = useFormState({
    mark: "",
    slabTypeId: 0,
    length: undefined,
    width: undefined,
    quantity: undefined,
    area: undefined,
  });

  // ---------- OPENINGS ----------
  const [openingTypes, setOpeningTypes] = useState<OpeningType[]>([]);
  const [editingOpeningId, setEditingOpeningId] = useState<number | null>(null);
  const { values: newOpening, update: updateOpening, reset: resetOpening } = useFormState({
    name: "",
    category: "Door",
    widthMm: undefined,
    heightMm: undefined,
    quantity: undefined,
    wallThicknessOption: "Half brick",
    wallThicknessMm: undefined,
    includeLintel: true,
    lintelBearingMm: 230,
    includeRevealPlaster: true,
    doorConfiguration: "Single",
    doorLeafType: "Hollow core timber door",
    doorFrameType: "Timber frame",
    paintDoor: false,
    paintFrame: false,
    includeIronmongery: false,
    includeThreshold: false,
    windowType: "Aluminium window",
    windowFrameType: "Aluminium",
    externalSill: false,
    internalSill: false,
  });
  const [openingMeasurements, setOpeningMeasurements] = useState<OpeningMeasurement[]>([]);
  const { values: newOpeningMeas, update: updateOpeningMeas, reset: resetOpeningMeas } = useFormState({
    mark: "",
    openingTypeId: 0,
    quantity: undefined,
    linkedWallId: undefined,
  });

  // ============================================
  // COST PLAN COMPONENTS STATE
  // ============================================
  const [costPlanComponents, setCostPlanComponents] = useState<CostPlanComponent[]>([]);

  // ============================================
  // RATES STATE
  // ============================================
  const [rates, setRates] = useState<Record<string, number>>({});

  // ============================================
  // AUTO-GENERATE COST PLAN COMPONENTS
  // ============================================
  useEffect(() => {
    const components = generateWallCostComponents(wallMeasurements, wallTypes);
    setCostPlanComponents(components);
    console.log("Generated cost plan components:", components.length);
  }, [wallMeasurements, wallTypes]);

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
      setOpeningTypes(savedData.openingTypes || []);
      setOpeningMeasurements(savedData.openingMeasurements || []);
      setRates(savedData.rates || {});
      setCostPlanComponents(savedData.costPlanComponents || []);
      console.log("Loaded cost plan components:", savedData.costPlanComponents?.length);
    }
  }, []);

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
      rates,
      costPlanComponents,
    };
    console.log("Saving cost plan components:", costPlanComponents.length);
    saveProjectData(data);
  };

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
    openingTypes,
    openingMeasurements,
    rates,
    costPlanComponents,
  ]);

  const handleClearProject = () => {
    if (confirm("Are you sure you want to clear all saved project data? This cannot be undone.")) {
      clearProjectData();
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
      setOpeningTypes([]);
      setOpeningMeasurements([]);
      setRates({});
      setCostPlanComponents([]);
    }
  };

  // Handle Excel export
  const handleExportExcel = () => {
    if (Object.keys(masterBoqItems).length === 0) {
      alert("No BOQ items to export. Add measurements first.");
      return;
    }
    exportBOQToExcel(masterBoqItems, rates, "My Project");
  };

  // ============================================
  // HANDLERS
  // ============================================

  // BEAM handlers
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
    if (beam) {
      updateBeam(beam);
      setEditingBeamId(id);
    }
  }

  function deleteBeamType(id: number) {
    setBeamTypes((prev) => prev.filter((b) => b.id !== id));
    setBeamMeasurements((prev) => prev.filter((m) => m.beamTypeId !== id));
  }

  function addBeamMeasurement() {
    if (!newBeamMeas.mark.trim() || newBeamMeas.beamTypeId === 0 || !newBeamMeas.length || newBeamMeas.length <= 0) return;
    const measurement = {
      id: Date.now(),
      ...newBeamMeas,
      elementalSectionId: "Structural Frame",
      elementalElementId: "beams",
    };
    if (editingBeamMeasurementId !== null) {
      setBeamMeasurements((prev) =>
        prev.map((m) => (m.id === editingBeamMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingBeamMeasurementId(null);
    } else {
      setBeamMeasurements((prev) => [...prev, measurement]);
    }
    resetBeamMeas();
  }

  function editBeamMeasurement(id: number) {
    const measurement = beamMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateBeamMeas(measurement);
      setEditingBeamMeasurementId(id);
    }
  }

  function deleteBeamMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setBeamMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingBeamMeasurementId === id) {
        setEditingBeamMeasurementId(null);
        resetBeamMeas();
      }
    }
  }

  // SURFACE BED handlers
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
    if (sb) {
      updateSurfaceBed(sb);
      setEditingSurfaceBedId(id);
    }
  }

  function deleteSurfaceBedType(id: number) {
    setSurfaceBedTypes((prev) => prev.filter((sb) => sb.id !== id));
    setSurfaceBedMeasurements((prev) => prev.filter((m) => m.surfaceBedTypeId !== id));
  }

  function addSurfaceBedMeasurement() {
    if (!newSurfaceBedMeas.mark.trim() || newSurfaceBedMeas.surfaceBedTypeId === 0 || !newSurfaceBedMeas.area || newSurfaceBedMeas.area <= 0) return;
    const measurement = {
      id: Date.now(),
      ...newSurfaceBedMeas,
      elementalSectionId: "ground-floor",
      elementalElementId: "solid-floors",
    };
    if (editingSurfaceBedMeasurementId !== null) {
      setSurfaceBedMeasurements((prev) =>
        prev.map((m) => (m.id === editingSurfaceBedMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingSurfaceBedMeasurementId(null);
    } else {
      setSurfaceBedMeasurements((prev) => [...prev, measurement]);
    }
    resetSurfaceBedMeas();
  }

  function editSurfaceBedMeasurement(id: number) {
    const measurement = surfaceBedMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateSurfaceBedMeas(measurement);
      setEditingSurfaceBedMeasurementId(id);
    }
  }

  function deleteSurfaceBedMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setSurfaceBedMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingSurfaceBedMeasurementId === id) {
        setEditingSurfaceBedMeasurementId(null);
        resetSurfaceBedMeas();
      }
    }
  }

  // PAD FOOTING handlers
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
    if (!newPadFootingMeas.mark.trim() || newPadFootingMeas.padFootingTypeId === 0 || !newPadFootingMeas.quantity || newPadFootingMeas.quantity <= 0) return;
    const measurement = {
      id: Date.now(),
      ...newPadFootingMeas,
      elementalSectionId: "substructure",
      elementalElementId: "pad-footings",
    };
    if (editingPadFootingMeasurementId !== null) {
      setPadFootingMeasurements((prev) =>
        prev.map((m) => (m.id === editingPadFootingMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingPadFootingMeasurementId(null);
    } else {
      setPadFootingMeasurements((prev) => [...prev, measurement]);
    }
    resetPadFootingMeas();
  }

  function editPadFootingMeasurement(id: number) {
    const measurement = padFootingMeasurements.find((m) => m.id === id);
    if (measurement) {
      updatePadFootingMeas(measurement);
      setEditingPadFootingMeasurementId(id);
    }
  }

  function deletePadFootingMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setPadFootingMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingPadFootingMeasurementId === id) {
        setEditingPadFootingMeasurementId(null);
        resetPadFootingMeas();
      }
    }
  }

  // GROUND BEAM handlers
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
    if (!newGroundBeamMeas.mark.trim() || newGroundBeamMeas.groundBeamTypeId === 0 || !newGroundBeamMeas.length || newGroundBeamMeas.length <= 0) return;
    const measurement = {
      id: Date.now(),
      ...newGroundBeamMeas,
      elementalSectionId: "substructure",
      elementalElementId: "ground-beams",
    };
    if (editingGroundBeamMeasurementId !== null) {
      setGroundBeamMeasurements((prev) =>
        prev.map((m) => (m.id === editingGroundBeamMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingGroundBeamMeasurementId(null);
    } else {
      setGroundBeamMeasurements((prev) => [...prev, measurement]);
    }
    resetGroundBeamMeas();
  }

  function editGroundBeamMeasurement(id: number) {
    const measurement = groundBeamMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateGroundBeamMeas(measurement);
      setEditingGroundBeamMeasurementId(id);
    }
  }

  function deleteGroundBeamMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setGroundBeamMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingGroundBeamMeasurementId === id) {
        setEditingGroundBeamMeasurementId(null);
        resetGroundBeamMeas();
      }
    }
  }

  // COLUMN handlers
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
    if (!newColumnMeas.mark.trim() || newColumnMeas.columnTypeId === 0 || !newColumnMeas.quantity || newColumnMeas.quantity <= 0) return;
    const measurement = {
      id: Date.now(),
      ...newColumnMeas,
      elementalSectionId: "Structural Frame",
      elementalElementId: "columns",
    };
    if (editingColumnMeasurementId !== null) {
      setColumnMeasurements((prev) =>
        prev.map((m) => (m.id === editingColumnMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingColumnMeasurementId(null);
    } else {
      setColumnMeasurements((prev) => [...prev, measurement]);
    }
    resetColumnMeas();
  }

  function editColumnMeasurement(id: number) {
    const measurement = columnMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateColumnMeas(measurement);
      setEditingColumnMeasurementId(id);
    }
  }

  function deleteColumnMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setColumnMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingColumnMeasurementId === id) {
        setEditingColumnMeasurementId(null);
        resetColumnMeas();
      }
    }
  }

  // SLAB handlers
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
    if (!newSlabMeas.mark.trim() || newSlabMeas.slabTypeId === 0 || !newSlabMeas.length || newSlabMeas.length <= 0 || !newSlabMeas.width || newSlabMeas.width <= 0 || !newSlabMeas.quantity || newSlabMeas.quantity <= 0) return;
    const area = newSlabMeas.length * newSlabMeas.width * newSlabMeas.quantity;
    const measurement = {
      id: Date.now(),
      ...newSlabMeas,
      area,
      elementalSectionId: "Structural Frame",
      elementalElementId: "slabs",
    };
    if (editingSlabMeasurementId !== null) {
      setSlabMeasurements((prev) =>
        prev.map((m) => (m.id === editingSlabMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingSlabMeasurementId(null);
    } else {
      setSlabMeasurements((prev) => [...prev, measurement]);
    }
    resetSlabMeas();
  }

  function editSlabMeasurement(id: number) {
    const measurement = slabMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateSlabMeas(measurement);
      setEditingSlabMeasurementId(id);
    }
  }

  function deleteSlabMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setSlabMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingSlabMeasurementId === id) {
        setEditingSlabMeasurementId(null);
        resetSlabMeas();
      }
    }
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
    // Validation
    if (!newWallMeas.mark.trim() || newWallMeas.wallTypeId === 0 || !newWallMeas.length || newWallMeas.length <= 0 || !newWallMeas.height || newWallMeas.height <= 0) {
      return;
    }

    const area = newWallMeas.length * newWallMeas.height;
    const wallLocation = newWallMeas.wallLocation || "Internal Division";

    // Create the measurement
    const measurement = {
      id: Date.now(),
      ...newWallMeas,
      area,
      wallLocation,
      elementalSectionId: "internal-divisions",
      elementalElementId: "walls",
    };

    // Save measurement
    if (editingWallMeasurementId !== null) {
      setWallMeasurements((prev) =>
        prev.map((m) => (m.id === editingWallMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingWallMeasurementId(null);
    } else {
      setWallMeasurements((prev) => [...prev, measurement]);
    }

    resetWallMeas();
  }

  function editWallMeasurement(id: number) {
    const measurement = wallMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateWallMeas(measurement);
      setEditingWallMeasurementId(id);
    }
  }

  function deleteWallMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setWallMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingWallMeasurementId === id) {
        setEditingWallMeasurementId(null);
        resetWallMeas();
      }
    }
  }

  // OPENING handlers
  function saveOpeningType() {
    if (!newOpening.name.trim()) return;
    if (editingOpeningId !== null) {
      setOpeningTypes((prev) =>
        prev.map((o) => (o.id === editingOpeningId ? { ...o, ...newOpening } : o))
      );
      setEditingOpeningId(null);
    } else {
      setOpeningTypes((prev) => [...prev, { id: Date.now(), ...newOpening }]);
    }
    resetOpening();
  }

  function editOpeningType(id: number) {
    const opening = openingTypes.find((o) => o.id === id);
    if (opening) {
      updateOpening(opening);
      setEditingOpeningId(id);
    }
  }

  function deleteOpeningType(id: number) {
    setOpeningTypes((prev) => prev.filter((o) => o.id !== id));
    setOpeningMeasurements((prev) => prev.filter((m) => m.openingTypeId !== id));
  }

  function addOpeningMeasurement() {
    if (!newOpeningMeas.mark.trim() || newOpeningMeas.openingTypeId === 0 || !newOpeningMeas.quantity || newOpeningMeas.quantity <= 0) return;
    const measurement = {
      id: Date.now(),
      ...newOpeningMeas,
      elementalSectionId: "Internal Divisions",
      elementalElementId: "Openings",
    };
    if (editingOpeningMeasurementId !== null) {
      setOpeningMeasurements((prev) =>
        prev.map((m) => (m.id === editingOpeningMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingOpeningMeasurementId(null);
    } else {
      setOpeningMeasurements((prev) => [...prev, measurement]);
    }
    resetOpeningMeas();
  }

  function editOpeningMeasurement(id: number) {
    const measurement = openingMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateOpeningMeas(measurement);
      setEditingOpeningMeasurementId(id);
    }
  }

  function deleteOpeningMeasurement(id: number) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setOpeningMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingOpeningMeasurementId === id) {
        setEditingOpeningMeasurementId(null);
        resetOpeningMeas();
      }
    }
  }

  // ============================================
  // MASTER BOQ ENGINE
  // ============================================
  const masterBoqItems: Record<string, BoqItem> = {};

  // ---------- BEAMS ----------
  beamMeasurements.forEach((m) => {
    const beam = beamTypes.find((b) => b.id === m.beamTypeId);
    if (!beam) return;

    const beamWidth = beam.beamWidthMm || beam.width || 230;
    const downstandDepth = beam.downstandDepthMm || beam.depth || 400;
    const upstandHeight = beam.upstandHeightMm || 0;
    const slabThickness = beam.slabThicknessMm || 0;
    const widthM = beamWidth / 1000;
    const downstandM = downstandDepth / 1000;

    // Concrete
    let concrete = 0;
    const profileType = beam.beamProfileType || "Downstand Beam";
    if (profileType === "Combined Downstand / Inverted Beam") {
      const overallDepth = downstandDepth + slabThickness + upstandHeight;
      concrete = (beamWidth / 1000) * (overallDepth / 1000) * m.length;
    } else {
      concrete = widthM * downstandM * m.length;
    }

    const totalReinf = (concrete * (beam.reinfKg || 0)) / 1000;
    const highTensile = totalReinf * 0.9;
    const mildSteel = totalReinf * 0.1;
    const strength = getConcreteStrength(beam.concreteClass);
    const finish = beam.formworkFinish || "Smooth";

    const baseContribution = (qty: number) => ({
      module: "Beams",
      measurementId: m.id,
      mark: m.mark,
      qty,
    });

    // Concrete
    let concreteDesc = `${beam.concreteClass} concrete in beams`;
    if (profileType === "Combined Downstand / Inverted Beam") {
      concreteDesc = `${beam.concreteClass} concrete in combined downstand / inverted beams`;
    }
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      concreteDesc,
      "m³",
      concrete,
      baseContribution(concrete)
    );

    // Reinforcement
    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile,
        baseContribution(highTensile)
      );
    }
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel,
        baseContribution(mildSteel)
      );
    }

    // Formwork
    if (profileType === "Integrated Beam / No Separate Beam Formwork") return;

    let proppingHeightDesc = "";
    if (beam.proppingHeightBand === "Custom") {
      proppingHeightDesc = beam.customProppingHeightDescription || "custom height";
    } else {
      proppingHeightDesc = beam.proppingHeightBand || "Not exceeding 1.5m";
    }

    // Combined beam formwork
    if (profileType === "Combined Downstand / Inverted Beam") {
      const overallDepth = downstandDepth + slabThickness + upstandHeight;
      const outerGirth = overallDepth + beamWidth + downstandDepth;
      const outerArea = (outerGirth / 1000) * m.length;
      if (outerArea > 0) {
        const desc = `${finish} formwork to sides and soffits of combined downstand / inverted beams, propped up ${proppingHeightDesc} high`;
        addBoqItemFromBillKey(
          masterBoqItems,
          "CONCRETE",
          SECTIONS.FORMWORK,
          desc,
          "m²",
          outerArea,
          baseContribution(outerArea)
        );
      }
      if (upstandHeight > 0) {
        if (upstandHeight <= 300) {
          const desc = `${finish} formwork to edges, risers, ends and reveals of inverted beams, propped up ${proppingHeightDesc} high`;
          addBoqItemFromBillKey(
            masterBoqItems,
            "CONCRETE",
            SECTIONS.FORMWORK,
            desc,
            "m",
            m.length,
            baseContribution(m.length)
          );
        } else {
          const invArea = (upstandHeight / 1000) * m.length;
          const desc = `${finish} formwork to sides of inverted beams, propped up ${proppingHeightDesc} high`;
          addBoqItemFromBillKey(
            masterBoqItems,
            "CONCRETE",
            SECTIONS.FORMWORK,
            desc,
            "m²",
            invArea,
            baseContribution(invArea)
          );
        }
      }
      return; // skip standard formwork
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
    const formworkArea = (girth / 1000) * m.length;
    if (formworkArea > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        desc,
        "m²",
        formworkArea,
        baseContribution(formworkArea)
      );
    }
  });

  // ---------- SURFACE BEDS ----------
  surfaceBedMeasurements.forEach((m) => {
    const sb = surfaceBedTypes.find((s) => s.id === m.surfaceBedTypeId);
    if (!sb) return;

    const concreteVol = m.area * (sb.thickness / 1000);
    const strength = getConcreteStrength(sb.concreteClass);
    const baseContribution = (qty: number) => ({
      module: "Surface Beds",
      measurementId: m.id,
      mark: m.mark,
      qty,
    });

    // Layers
    if (sb.layer1Material && sb.layer1Thickness > 0) {
      addLayerToBoq(masterBoqItems, sb.layer1Material, sb.layer1Thickness, m.area, baseContribution(m.area));
    }
    if (sb.layer2Material && sb.layer2Thickness > 0) {
      addLayerToBoq(masterBoqItems, sb.layer2Material, sb.layer2Thickness, m.area, baseContribution(m.area));
    }
    if (sb.layer3Material && sb.layer3Thickness > 0) {
      addLayerToBoq(masterBoqItems, sb.layer3Material, sb.layer3Thickness, m.area, baseContribution(m.area));
    }

    // DPM
    if (sb.dpm) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "WATERPROOFING",
        SECTIONS.DPM,
        "DPM under surface beds",
        "m²",
        m.area,
        baseContribution(m.area)
      );
    }

    // Soil Poison
    if (sb.soilPoison) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.SOIL_POISONING,
        "Soil poisoning under surface beds",
        "m²",
        m.area,
        baseContribution(m.area)
      );
    }

    // Mesh
    if (sb.meshType !== "None") {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Fabric reinforcement",
        "m²",
        m.area,
        baseContribution(m.area)
      );
    }

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${sb.concreteClass} concrete in surface beds`,
      "m³",
      concreteVol,
      baseContribution(concreteVol)
    );

    // Screed
    if (sb.screedRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.SCREEDS,
        `${sb.screedThickness}mm screed ${sb.screedType}`,
        "m²",
        m.area,
        baseContribution(m.area)
      );
    }

    // Tiles
    if (sb.tileRequired && sb.tilePcSum && sb.tilePcSum > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "TILING",
        SECTIONS.TILING,
        `Tiles PC Sum R${sb.tilePcSum}/m²`,
        "m²",
        m.area,
        baseContribution(m.area)
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
        m.area,
        baseContribution(m.area)
      );
    }
  });

  // ---------- PAD FOOTINGS ----------
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
    const baseContribution = (q: number) => ({
      module: "Pad Footings",
      measurementId: m.id,
      mark: m.mark,
      qty: q,
    });

    // Excavation
    addBoqItemFromBillKey(
      masterBoqItems,
      "EARTHWORKS",
      SECTIONS.EXCAVATION,
      "Excavation for pad footings",
      "m³",
      excavationVol,
      baseContribution(excavationVol)
    );

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${pf.concreteClass} concrete in pad footings`,
      "m³",
      padConcrete,
      baseContribution(padConcrete)
    );

    // Reinforcement
    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile,
        baseContribution(highTensile)
      );
    }
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel,
        baseContribution(mildSteel)
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
        formwork,
        baseContribution(formwork)
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
        blinding,
        baseContribution(blinding)
      );
    }

    // Soil Poisoning
    if (pf.soilPoison) {
      const area = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * qty;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.SOIL_POISONING,
        "Soil poisoning to pad footings",
        "m²",
        area,
        baseContribution(area)
      );
    }

    // Backfill
    if (pf.backfill) {
      const backfill = excavationVol - padConcrete;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BACKFILLING,
        "Backfill to pad footings",
        "m³",
        backfill,
        baseContribution(backfill)
      );
    }
  });

  // ---------- GROUND BEAMS ----------
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
    const baseContribution = (q: number) => ({
      module: "Ground Beams",
      measurementId: m.id,
      mark: m.mark,
      qty: q,
    });

    // Excavation
    addBoqItemFromBillKey(
      masterBoqItems,
      "EARTHWORKS",
      SECTIONS.EXCAVATION,
      "Excavation for ground beams",
      "m³",
      trenchVol,
      baseContribution(trenchVol)
    );

    // Concrete
    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${gb.concreteClass} concrete in ground beams`,
      "m³",
      concreteVol,
      baseContribution(concreteVol)
    );

    // Reinforcement
    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile,
        baseContribution(highTensile)
      );
    }
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel,
        baseContribution(mildSteel)
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
        formwork,
        baseContribution(formwork)
      );
    }

    // Blinding
    if (gb.blindingRequired) {
      const blinding = (gb.beamWidth / 1000) * (gb.blindingThickness / 1000) * length;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BLINDING,
        `${gb.blindingThickness}mm blinding under ground beams`,
        "m³",
        blinding,
        baseContribution(blinding)
      );
    }

    // Backfill
    if (gb.backfillRequired) {
      const backfill = trenchVol - concreteVol;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.BACKFILLING,
        "Backfill to ground beams",
        "m³",
        backfill,
        baseContribution(backfill)
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
        dpcArea,
        baseContribution(dpcArea)
      );
    }

    // Soil Poisoning
    if (gb.soilPoisonRequired) {
      const area = (gb.trenchWidth / 1000) * length;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        SECTIONS.SOIL_POISONING,
        "Soil poisoning under ground beams",
        "m²",
        area,
        baseContribution(area)
      );
    }

    // WORKING SPACE (only if formwork is required)
    if (gb.formworkRequired && gb.workingSpaceRequired) {
      const trenchWidthM = gb.trenchWidth / 1000;
      const depthM = gb.trenchDepth / 1000;
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
        const desc = `Back excavation of vertical sides of excavations in earth for working space including backfilling compacted to 95% Mod AASHTO density: ${depthBandDesc} for placing and removing formwork to beams, bases etc, where excavated face abuts concrete face.`;
        addBoqItemFromBillKey(
          masterBoqItems,
          "EARTHWORKS",
          "Working Space",
          desc,
          "m²",
          workingSpaceArea,
          baseContribution(workingSpaceArea)
        );
      }
    }

    // RISK OF COLLAPSE (applies regardless of formwork)
    if (gb.riskOfCollapseRequired) {
      const trenchWidthM = gb.trenchWidth / 1000;
      const depthM = gb.trenchDepth / 1000;
      const perimeter = 2 * (trenchWidthM + depthM);
      const collapseArea = perimeter * length;
      let bandDesc = depthM <= 1.5 ? "not exceeding 1.5m deep" : "exceeding 1.5m deep";
      const desc = `Sides of trench and hole excavations ${bandDesc}`;
      addBoqItemFromBillKey(
        masterBoqItems,
        "EARTHWORKS",
        "Risk of Collapse",
        desc,
        "m²",
        collapseArea,
        baseContribution(collapseArea)
      );
    }
  });

  // ---------- COLUMNS ----------
  columnMeasurements.forEach((m) => {
    const col = columnTypes.find((c) => c.id === m.columnTypeId);
    if (!col) return;

    const qty = m.quantity;
    const concreteVol = (col.width / 1000) * (col.depth / 1000) * (col.height / 1000) * qty;
    const totalReinf = (concreteVol * col.reinfKgPerM3) / 1000;
    const highTensile = totalReinf * 0.9;
    const mildSteel = totalReinf * 0.1;
    const strength = getConcreteStrength(col.concreteClass);
    const baseContribution = (q: number) => ({
      module: "Columns",
      measurementId: m.id,
      mark: m.mark,
      qty: q,
    });

    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${col.concreteClass} concrete in columns`,
      "m³",
      concreteVol,
      baseContribution(concreteVol)
    );

    if (highTensile > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "High tensile reinforcement",
        "t",
        highTensile,
        baseContribution(highTensile)
      );
    }
    if (mildSteel > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Mild steel reinforcement",
        "t",
        mildSteel,
        baseContribution(mildSteel)
      );
    }

    if (col.formworkRequired) {
      const perimeter = 2 * ((col.width / 1000) + (col.depth / 1000));
      const formwork = perimeter * (col.height / 1000) * qty;
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        `${col.formworkFinish} formwork to sides of columns`,
        "m²",
        formwork,
        baseContribution(formwork)
      );
    }
  });

  // ---------- WALLS ----------
  wallMeasurements.forEach((m) => {
    const wall = wallTypes.find((w) => w.id === m.wallTypeId);
    if (!wall) return;

    const area = m.area;
    const baseContribution = (qty: number) => ({
      module: "Walls",
      measurementId: m.id,
      mark: m.mark,
      qty,
    });

    // Brickwork
    addBoqItemFromBillKey(
      masterBoqItems,
      "MASONRY",
      SECTIONS.BRICKWORK,
      `${wall.brickType} brickwork - ${wall.thicknessType}`,
      "m²",
      area,
      baseContribution(area)
    );

    // DPC
    if (wall.dpcRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "MASONRY",
        SECTIONS.DAMP_PROOF_COURSES,
        "Damp-proof course",
        "m",
        m.length,
        baseContribution(m.length)
      );
    }

    // Reinforcement
    if (wall.reinforcementRequired && wall.courseHeight && wall.coursesPerReinforcement) {
      let wallThicknessMm = 0;
      if (wall.thicknessType === "Single Skin (Half Brick)") wallThicknessMm = 102;
      else if (wall.thicknessType === "Double Skin (One Brick)") wallThicknessMm = 215;
      else if (wall.thicknessType === "Cavity Wall") wallThicknessMm = 275;
      else if (wall.thicknessType === "Triple Skin") wallThicknessMm = 327;
      else if (wall.thicknessMm) wallThicknessMm = wall.thicknessMm;

      const layers = Math.floor((m.height * 1000) / (wall.courseHeight * wall.coursesPerReinforcement));
      const totalLength = m.length * layers;
      if (totalLength > 0) {
        const widthLabel = wallThicknessMm > 102 ? "150mm" : "75mm";
        const desc = `${widthLabel} ${wall.reinforcementType} bed joint reinforcement`;
        addBoqItemFromBillKey(
          masterBoqItems,
          "MASONRY",
          SECTIONS.MASONRY_REINFORCEMENT,
          desc,
          "m",
          totalLength,
          baseContribution(totalLength)
        );
      }
    }

    // Side-based finishes
    const processSide = (side: 1 | 2) => {
      const plaster = side === 1 ? wall.side1Plaster : wall.side2Plaster;
      const finish = side === 1 ? wall.side1Finish : wall.side2Finish;
      const tilePcSum = side === 1 ? wall.side1TilePcSum : wall.side2TilePcSum;
      const sideLabel = side === 1 ? "side 1" : "side 2";

      if (plaster) {
        addBoqItemFromBillKey(
          masterBoqItems,
          "PLASTERING",
          SECTIONS.PLASTER,
          `Plaster to walls (${sideLabel}) - ${wall.thicknessType}`,
          "m²",
          area,
          baseContribution(area)
        );
      }

      if (finish === "Paint") {
        addBoqItemFromBillKey(
          masterBoqItems,
          "PAINTWORK",
          SECTIONS.PAINT,
          `Paint to walls (${sideLabel}) - ${wall.thicknessType}`,
          "m²",
          area,
          baseContribution(area)
        );
      } else if (finish === "Tile") {
        const pcSum = tilePcSum || 0;
        if (pcSum > 0) {
          addBoqItemFromBillKey(
            masterBoqItems,
            "TILING",
            SECTIONS.TILING,
            `Wall tiles (${sideLabel}) - PC Sum R${pcSum}/m²`,
            "m²",
            area,
            baseContribution(area)
          );
        }
      }
    };

    processSide(1);
    processSide(2);
  });

  // ---------- SLABS ----------
  slabMeasurements.forEach((m) => {
    const slab = slabTypes.find((s) => s.id === m.slabTypeId);
    if (!slab) return;

    const area = m.area;
    const concreteVol = area * (slab.thickness / 1000);
    const strength = getConcreteStrength(slab.concreteClass);
    const baseContribution = (q: number) => ({
      module: "Slabs",
      measurementId: m.id,
      mark: m.mark,
      qty: q,
    });

    addBoqItemFromBillKey(
      masterBoqItems,
      "CONCRETE",
      `Concrete (${strength})`,
      `${slab.concreteClass} concrete in suspended slab`,
      "m³",
      concreteVol,
      baseContribution(concreteVol)
    );

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
          highTensile,
          baseContribution(highTensile)
        );
      }
      if (mildSteel > 0) {
        addBoqItemFromBillKey(
          masterBoqItems,
          "CONCRETE",
          SECTIONS.REINFORCEMENT,
          "Mild steel reinforcement",
          "t",
          mildSteel,
          baseContribution(mildSteel)
        );
      }
    } else if (slab.reinfType === "Mesh" && slab.meshType && slab.meshType !== "None") {
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.REINFORCEMENT,
        "Fabric reinforcement",
        "m²",
        area,
        baseContribution(area)
      );
    }

    if (slab.formworkToEdges) {
      const perimeter = 2 * (m.length + m.width) * m.quantity;
      const formwork = perimeter * (slab.thickness / 1000);
      addBoqItemFromBillKey(
        masterBoqItems,
        "CONCRETE",
        SECTIONS.FORMWORK,
        "Formwork to edges of slabs",
        "m²",
        formwork,
        baseContribution(formwork)
      );
    }

    if (slab.screedRequired) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.SCREEDS,
        `${slab.screedThickness}mm screed to slab`,
        "m²",
        area,
        baseContribution(area)
      );
    }

    if (slab.floorFinishPcSum > 0) {
      addBoqItemFromBillKey(
        masterBoqItems,
        "FLOOR_COVERINGS",
        SECTIONS.FLOOR_FINISHES,
        `${slab.floorFinishDescription} floor finish PC R${slab.floorFinishPcSum}/m²`,
        "m²",
        area,
        baseContribution(area)
      );
    }
  });

  // ---------- OPENINGS ----------
  openingMeasurements.forEach((m) => {
    const op = openingTypes.find((o) => o.id === m.openingTypeId);
    if (!op) return;

    const qty = m.quantity;
    const width = op.widthMm / 1000;
    const height = op.heightMm / 1000;
    const perimeter = 2 * height + width;
    const wallThickness = op.wallThicknessOption === "Half brick" ? 0.102
      : op.wallThicknessOption === "One brick" ? 0.215
      : (op.wallThicknessMm || 0) / 1000;

    const addItem = (billKey: string, section: string, desc: string, unit: string, q: number) => {
      if (q > 0) {
        addBoqItemFromBillKey(
          masterBoqItems,
          billKey,
          section,
          desc,
          unit,
          q,
          { module: "Openings", measurementId: m.id, mark: m.mark, qty: q }
        );
      }
    };

    if (op.includeLintel) {
      const lintelLength = (op.widthMm + 2 * op.lintelBearingMm) / 1000;
      let category = "";
      if (lintelLength <= 3.0) category = "not exceeding 3.0m";
      else if (lintelLength <= 4.5) category = "exceeding 3.0m but not exceeding 4.5m";
      else if (lintelLength <= 6.0) category = "exceeding 4.5m but not exceeding 6.0m";
      else if (lintelLength <= 7.5) category = "exceeding 6.0m but not exceeding 7.5m";
      else category = "exceeding 7.5m";
      const desc = `Prestressed concrete lintel ${category} over openings`;
      addItem("MASONRY", SECTIONS.LINTELS, desc, "m", lintelLength * qty);
    }

    if (op.includeRevealPlaster && wallThickness > 0) {
      const area = perimeter * wallThickness;
      const descPlaster = `Plaster to narrow widths around ${op.category.toLowerCase()} openings`;
      addItem("PLASTERING", SECTIONS.NARROW_WIDTHS, descPlaster, "m²", area * qty);
      const descPaint = `Paint to narrow widths around ${op.category.toLowerCase()} openings`;
      addItem("PAINTWORK", SECTIONS.NARROW_WIDTHS, descPaint, "m²", area * qty);
    }

    if (op.category === "Door") {
      const config = op.doorConfiguration || "Single";
      const leafType = op.doorLeafType || "Hollow core timber door";
      const frameType = op.doorFrameType || "Timber frame";
      const doorW = op.widthMm;
      const doorH = op.heightMm;

      let leafBill = "CARPENTRY";
      if (leafType.includes("Aluminium") || leafType.includes("Steel")) leafBill = "METALWORK";
      const leafDesc = `${config} ${leafType} ${doorW} x ${doorH}mm high`;
      addItem(leafBill, SECTIONS.DOORS, leafDesc, "No", qty);

      let frameBill = "CARPENTRY";
      if (frameType !== "Timber frame") frameBill = "METALWORK";
      let frameLen = 2 * doorH + doorW;
      if (op.includeThreshold) frameLen += doorW;
      const frameLenM = frameLen / 1000;
      const frameDesc = `${frameType} for ${config} door`;
      addItem(frameBill, SECTIONS.FRAMES, frameDesc, "m", frameLenM * qty);

      if (op.includeIronmongery) {
        addItem("IRONMONGERY", SECTIONS.IRONMONGERY, "Standard ironmongery set", "No", qty);
      }

      if (op.paintDoor) {
        const paintArea = (doorW / 1000) * (doorH / 1000) * 2;
        addItem("PAINTWORK", SECTIONS.PAINT, "Paint to doors", "m²", paintArea * qty);
      }
      if (op.paintFrame) {
        const paintArea = frameLenM * 0.1;
        addItem("PAINTWORK", SECTIONS.PAINT, "Paint to door frames", "m²", paintArea * qty);
      }
    }

    if (op.category === "Window") {
      const winType = op.windowType || "Aluminium window";
      const frameType = op.windowFrameType || "Aluminium";
      const winW = op.widthMm;
      const winH = op.heightMm;

      let winBill = "METALWORK";
      if (winType.includes("Timber")) winBill = "CARPENTRY";
      const winDesc = `${winType} ${winW} x ${winH}mm high`;
      addItem(winBill, SECTIONS.WINDOWS, winDesc, "No", qty);

      if (op.externalSill) {
        const sillLen = winW / 1000;
        addItem("MASONRY", SECTIONS.SILLS, "External sill to window openings", "m", sillLen * qty);
      }
      if (op.internalSill) {
        const sillLen = winW / 1000;
        addItem("CARPENTRY", SECTIONS.SILLS, "Internal sill to window openings", "m", sillLen * qty);
      }
      if (op.paintFrame) {
        const framePerim = 2 * (winW + winH) / 1000;
        const paintArea = framePerim * 0.1;
        addItem("PAINTWORK", SECTIONS.PAINT, "Paint to window frames", "m²", paintArea * qty);
      }
    }
  });

 // ============================================
// TAB STATE
// ============================================
const [activeTab, setActiveTab] = useState<"dashboard" | "measurement" | "boq" | "reports" | "settings">("dashboard");

// ============================================
// TAB STYLES - ADD THIS HERE
// ============================================
const tabBarStyle = {
  display: "flex",
  gap: "4px",
  marginBottom: "24px",
  borderBottom: "2px solid #ddd",
  paddingBottom: "0",
  backgroundColor: "#ffffff",
  borderRadius: "8px 8px 0 0",
  padding: "8px 12px 0 12px",
  flexWrap: "wrap" as const,
};

const tabButtonStyle = (isActive: boolean) => ({
  padding: "10px 20px",
  border: "none",
  backgroundColor: isActive ? "#0066cc" : "transparent",
  color: isActive ? "#ffffff" : "#333333",
  borderRadius: "6px 6px 0 0",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: isActive ? "600" : "400",
  transition: "all 0.2s",
  borderBottom: isActive ? "3px solid #0066cc" : "3px solid transparent",
  marginBottom: "-2px",
});

  // ============================================
  // RENDER
  // ============================================
  return (
    <main style={pageStyle}>
      {/* Header with title and buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>BOQ Measurement Software</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleExportExcel}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Export to Excel
          </button>
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
      </div>

      {/* Top Navigation */}
      <div style={tabBarStyle}>
        <button style={tabButtonStyle(activeTab === "dashboard")} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button style={tabButtonStyle(activeTab === "measurement")} onClick={() => setActiveTab("measurement")}>
          Elemental Measurement
        </button>
        <button style={tabButtonStyle(activeTab === "boq")} onClick={() => setActiveTab("boq")}>
          Detailed BOQ
        </button>
        <button style={tabButtonStyle(activeTab === "reports")} onClick={() => setActiveTab("reports")}>
          Reports
        </button>
        <button style={tabButtonStyle(activeTab === "settings")} onClick={() => setActiveTab("settings")}>
          Project Settings
        </button>
      </div>

      {/* Content */}
      <div style={{ marginTop: "20px" }}>
        {activeTab === "dashboard" && (
          <Dashboard boqItems={masterBoqItems} styles={{ cardStyle }} />
        )}

        {activeTab === "measurement" && (
          <ElementalMeasurement
            styles={{ cardStyle, formGridStyle, tableStyle, thStyle, tdStyle }}
            moduleProps={{
              beam: {
                beamTypes,
                setBeamTypes,
                editingBeamId,
                setEditingBeamId,
                newBeam,
                updateBeam,
                resetBeam,
                beamMeasurements,
                setBeamMeasurements,
                newBeamMeas,
                updateBeamMeas,
                resetBeamMeas,
                editingBeamMeasurementId,
                setEditingBeamMeasurementId,
              },
              groundBeam: {
                groundBeamTypes,
                setGroundBeamTypes,
                editingGroundBeamId,
                setEditingGroundBeamId,
                newGroundBeam,
                updateGroundBeam,
                resetGroundBeam,
                groundBeamMeasurements,
                setGroundBeamMeasurements,
                newGroundBeamMeas,
                updateGroundBeamMeas,
                resetGroundBeamMeas,
                editingGroundBeamMeasurementId,
                setEditingGroundBeamMeasurementId,
              },
              padFooting: {
                padFootingTypes,
                setPadFootingTypes,
                editingPadFootingId,
                setEditingPadFootingId,
                newPadFooting,
                updatePadFooting,
                resetPadFooting,
                padFootingMeasurements,
                setPadFootingMeasurements,
                newPadFootingMeas,
                updatePadFootingMeas,
                resetPadFootingMeas,
                editingPadFootingMeasurementId,
                setEditingPadFootingMeasurementId,
              },
              column: {
                columnTypes,
                setColumnTypes,
                editingColumnId,
                setEditingColumnId,
                newColumn,
                updateColumn,
                resetColumn,
                columnMeasurements,
                setColumnMeasurements,
                newColumnMeas,
                updateColumnMeas,
                resetColumnMeas,
                editingColumnMeasurementId,
                setEditingColumnMeasurementId,
              },
              slab: {
                slabTypes,
                setSlabTypes,
                editingSlabId,
                setEditingSlabId,
                newSlab,
                updateSlab,
                resetSlab,
                slabMeasurements,
                setSlabMeasurements,
                newSlabMeas,
                updateSlabMeas,
                resetSlabMeas,
                editingSlabMeasurementId,
                setEditingSlabMeasurementId,
              },
              surfaceBed: {
                surfaceBedTypes,
                setSurfaceBedTypes,
                editingSurfaceBedId,
                setEditingSurfaceBedId,
                newSurfaceBed,
                updateSurfaceBed,
                resetSurfaceBed,
                surfaceBedMeasurements,
                setSurfaceBedMeasurements,
                newSurfaceBedMeas,
                updateSurfaceBedMeas,
                resetSurfaceBedMeas,
                editingSurfaceBedMeasurementId,
                setEditingSurfaceBedMeasurementId,
              },
              wall: {
                wallTypes,
                setWallTypes,
                editingWallId,
                setEditingWallId,
                newWall,
                updateWall,
                resetWall,
                wallMeasurements,
                setWallMeasurements,
                newWallMeas,
                updateWallMeas,
                resetWallMeas,
                editingWallMeasurementId,
                setEditingWallMeasurementId,
              },
              openings: {
                openingTypes,
                setOpeningTypes,
                editingOpeningId,
                setEditingOpeningId,
                newOpening,
                updateOpening,
                resetOpening,
                openingMeasurements,
                setOpeningMeasurements,
                newOpeningMeas,
                updateOpeningMeas,
                resetOpeningMeas,
                editingOpeningMeasurementId,
                setEditingOpeningMeasurementId,
              },
            }}
          />
        )}

        {activeTab === "boq" && (
          <>
            <h2>Detailed BOQ</h2>
            <BoqSummary
              boqItems={masterBoqItems}
              rates={rates}
              onRateChange={(key, rate) => {
                setRates((prev) => ({ ...prev, [key]: rate }));
              }}
              styles={styles}
            />
          </>
        )}

        {activeTab === "reports" && (
          <>
            {/* Cost Summary */}
            <ElementalCostSummary
              costPlanComponents={costPlanComponents}
              rates={rates}
              styles={{ cardStyle, tableStyle, thStyle, tdStyle }}
            />

            {/* Quantity Summary */}
            <ElementalSummary
              beamMeasurements={beamMeasurements}
              surfaceBedMeasurements={surfaceBedMeasurements}
              padFootingMeasurements={padFootingMeasurements}
              groundBeamMeasurements={groundBeamMeasurements}
              columnMeasurements={columnMeasurements}
              wallMeasurements={wallMeasurements}
              slabMeasurements={slabMeasurements}
              openingMeasurements={openingMeasurements}
              boqItems={masterBoqItems}
              styles={{ cardStyle, tableStyle, thStyle, tdStyle }}
            />
          </>
        )}

        {activeTab === "settings" && (
          <div style={cardStyle}>
            <h2>Project Settings</h2>
            <p>Project details, rates, and measurement rules.</p>
            <p style={{ color: "#999", marginTop: "16px" }}>Coming soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}