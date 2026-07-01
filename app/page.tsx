"use client";

import { useEffect, useMemo, useState } from "react";
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
  CostPlan,
  CostPlanItem,
  ExecutiveSummaryInputData,
  MeasurementItem, 
  ComputedMeasurementItem, 
  Element,
} from "@/types/boq";
import { RecalcEngine } from "@/lib/costEngine";
import { DEFAULT_ELEMENTS } from "@/lib/domain";
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
import {
  generateWallCostPlanComponents,
  generateWallBoqItems,
  generateSlabCostPlanComponents,
  generateSlabBoqItems,
  generateBeamCostPlanComponents,
  generateBeamBoqItems,
  generateColumnCostPlanComponents,
  generateColumnBoqItems,
  generateSurfaceBedCostPlanComponents,
  generateSurfaceBedBoqItems,
  generateGroundBeamCostPlanComponents,
  generateGroundBeamBoqItems,
  generatePadFootingCostPlanComponents,
  generatePadFootingBoqItems,
  generateOpeningCostPlanComponents,
  generateOpeningBoqItems,
} from "@/lib/measurementOutputEngine";

import {
  wallDefaults,
  slabDefaults,
  padFootingDefaults,
  groundBeamDefaults,
  columnDefaults,
  surfaceBedDefaults,
  openingDefaults,
} from "@/lib/moduleDefaults";

// Layout components
import BoqSummary from "@/components/modules/BoqSummary";
import Dashboard from "@/components/dashboard/Dashboard";
import ElementalMeasurement from "@/components/elements/ElementalMeasurement";
import ReportsTab from "@/components/reports/ReportsTab";
import CostPlanManager from "@/components/cost-plans/CostPlanManager";

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

// ============================================
// FIXED: useFormState hook with proper defaults
// ============================================
function useFormState<T extends Record<string, any>>(
  initialState: T,
  defaults: Partial<T> = {}
) {
  const fullInitialState = { ...defaults, ...initialState };
  const [values, setValues] = useState<T>(fullInitialState);

  const reset = () => setValues(fullInitialState);
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
    width: 0,
    depth: 0,
    reinfKg: 0,
    formworkFinish: "Smooth",
    concreteClass: "25MPa/19mm",
    beamProfileType: "Downstand Beam",
    beamWidthMm: 0,
    downstandDepthMm: 0,
    upstandHeightMm: 0,
    slabThicknessMm: 0,
    proppingHeightBand: "Not exceeding 1.5m",
    customProppingHeightDescription: "",
  });
  const [beamMeasurements, setBeamMeasurements] = useState<BeamMeasurement[]>([]);
  const { values: newBeamMeas, update: updateBeamMeas, reset: resetBeamMeas } = useFormState({
    mark: "",
    beamTypeId: 0,
    length: 0,
  });

  // ---------- SURFACE BED ----------
  const [surfaceBedTypes, setSurfaceBedTypes] = useState<SurfaceBedType[]>([]);
  const [editingSurfaceBedId, setEditingSurfaceBedId] = useState<number | null>(null);
  const { values: newSurfaceBed, update: updateSurfaceBed, reset: resetSurfaceBed } = useFormState({
    name: "",
    category: "Internal",
    thickness: 0,
    concreteClass: "35MPa/19mm",
    meshType: "Ref193",
    dpm: true,
    soilPoison: true,
    layer1Material: "",
    layer1Thickness: 0,
    layer2Material: "",
    layer2Thickness: 0,
    layer3Material: "",
    layer3Thickness: 0,
    powerfloat: true,
    screedRequired: false,
    screedThickness: 0,
    screedType: "Normal",
    tileRequired: false,
    tilePcSum: 0,
  });
  const [surfaceBedMeasurements, setSurfaceBedMeasurements] = useState<SurfaceBedMeasurement[]>([]);
  const { values: newSurfaceBedMeas, update: updateSurfaceBedMeas, reset: resetSurfaceBedMeas } = useFormState({
    mark: "",
    surfaceBedTypeId: 0,
    area: 0,
  });

  // ---------- PAD FOOTING ----------
  const [padFootingTypes, setPadFootingTypes] = useState<PadFootingType[]>([]);
  const [editingPadFootingId, setEditingPadFootingId] = useState<number | null>(null);
  const { values: newPadFooting, update: updatePadFooting, reset: resetPadFooting } = useFormState({
    name: "",
    padLength: 0,
    padWidth: 0,
    padDepth: 0,
    excavationLength: 0,
    excavationWidth: 0,
    excavationDepth: 0,
    concreteClass: "30MPa/19mm",
    reinfKg: 0,
    formworkRequired: true,
    blindingRequired: true,
    blindingThickness: 0,
    soilPoison: false,
    backfill: true,
    workingSpaceRequired: false,
    riskOfCollapseRequired: false,
  });
  const [padFootingMeasurements, setPadFootingMeasurements] = useState<PadFootingMeasurement[]>([]);
  const { values: newPadFootingMeas, update: updatePadFootingMeas, reset: resetPadFootingMeas } = useFormState({
    mark: "",
    padFootingTypeId: 0,
    quantity: 0,
  });

  // ---------- GROUND BEAM ----------
  const [groundBeamTypes, setGroundBeamTypes] = useState<GroundBeamType[]>([]);
  const [editingGroundBeamId, setEditingGroundBeamId] = useState<number | null>(null);
  const { values: newGroundBeam, update: updateGroundBeam, reset: resetGroundBeam } = useFormState({
    name: "",
    trenchWidth: 0,
    trenchDepth: 0,
    beamWidth: 0,
    beamDepth: 0,
    concreteClass: "30MPa/19mm",
    reinfKgPerM3: 0,
    formworkRequired: true,
    blindingRequired: true,
    blindingThickness: 0,
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
    length: 0,
  });

  // ---------- COLUMN ----------
  const [columnTypes, setColumnTypes] = useState<ColumnType[]>([]);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const { values: newColumn, update: updateColumn, reset: resetColumn } = useFormState({
    name: "",
    width: 0,
    depth: 0,
    height: 0,
    concreteClass: "35MPa/19mm",
    reinfKgPerM3: 0,
    formworkRequired: true,
    formworkFinish: "Smooth",
  });
  const [columnMeasurements, setColumnMeasurements] = useState<ColumnMeasurement[]>([]);
  const { values: newColumnMeas, update: updateColumnMeas, reset: resetColumnMeas } = useFormState({
    mark: "",
    columnTypeId: 0,
    quantity: 0,
  });

  // ---------- WALL ----------
  const [wallTypes, setWallTypes] = useState<WallType[]>([]);
  const [editingWallId, setEditingWallId] = useState<number | null>(null);
  const { values: newWall, update: updateWall, reset: resetWall } = useFormState({
    name: "",
    brickType: "Common",
    thicknessType: "Single Skin (Half Brick)",
    thicknessMm: 0,
    courseHeight: 75,
    side1Plaster: true,
    side1Finish: "Paint",
    side1TilePcSum: 0,
    side2Plaster: true,
    side2Finish: "Paint",
    side2TilePcSum: 0,
    dpcRequired: true,
    reinforcementRequired: false,
    coursesPerReinforcement: 4,
    reinforcementType: "Galvanised mesh",
  });
  const [wallMeasurements, setWallMeasurements] = useState<WallMeasurement[]>([]);
  const { values: newWallMeas, update: updateWallMeas, reset: resetWallMeas } = useFormState({
    mark: "",
    wallTypeId: 0,
    length: 0,
    height: 0,
    area: 0,
    wallLocation: "Internal Division",
  });

  // ---------- SLAB ----------
  const [slabTypes, setSlabTypes] = useState<SlabType[]>([]);
  const [editingSlabId, setEditingSlabId] = useState<number | null>(null);
  const { values: newSlab, update: updateSlab, reset: resetSlab } = useFormState({
    name: "",
    thickness: 0,
    concreteClass: "30MPa/19mm",
    reinfType: "Rebar",
    reinfKgPerM3: 0,
    meshType: "A193",
    formworkToEdges: true,
    screedRequired: false,
    screedThickness: 0,
    floorFinishPcSum: 0,
    floorFinishDescription: "Tiles",
  });
  const [slabMeasurements, setSlabMeasurements] = useState<SlabMeasurement[]>([]);
  const { values: newSlabMeas, update: updateSlabMeas, reset: resetSlabMeas } = useFormState({
    mark: "",
    slabTypeId: 0,
    length: 0,
    width: 0,
    quantity: 0,
    area: 0,
  });

  // ---------- OPENINGS ----------
  const [openingTypes, setOpeningTypes] = useState<OpeningType[]>([]);
  const [editingOpeningId, setEditingOpeningId] = useState<number | null>(null);
  const { values: newOpening, update: updateOpening, reset: resetOpening } = useFormState({
    name: "",
    category: "Door",
    widthMm: 0,
    heightMm: 0,
    quantity: 0,
    wallThicknessOption: "Half brick",
    wallThicknessMm: 0,
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
    quantity: 0,
    linkedWallId: 0,
  });

  // ============================================
  // COST PLAN COMPONENTS STATE (LEGACY - KEEP FOR NOW)
  // ============================================
  const [costPlanComponents, setCostPlanComponents] = useState<CostPlanComponent[]>([]);

  // ============================================
  // COST PLANS & MEASUREMENT ITEMS (NEW)
  // ============================================
  const [costPlans, setCostPlans] = useState<CostPlan[]>([]);
  const [measurementItems, setMeasurementItems] = useState<MeasurementItem[]>([]);
  const [computedItems, setComputedItems] = useState<ComputedMeasurementItem[]>([]);
  const [elements, setElements] = useState<Element[]>(DEFAULT_ELEMENTS);

  // ============================================
  // RATES STATE
  // ============================================
  const [rates, setRates] = useState<Record<string, number>>({});

  // ============================================
  // EXECUTIVE SUMMARY INPUT STATE (Persisted)
  // ============================================
  const [executiveInput, setExecutiveInput] = useState<ExecutiveSummaryInputData>({
    projectName: "My Project",
    baseDate: new Date().toISOString().split("T")[0],
    buildingArea: 0,
    specialistServices: [],
    preliminaries: 0,
    preliminariesPercent: 0,
    contingency: 0,
    contingencyPercent: 0,
    escalations: {
      preConstructionMonths: 6,
      preConstructionRate: 5,
      constructionMonths: 12,
      constructionRate: 8,
    },
    professionalFees: {
      coreConsultants: 0,
      specialistConsultants: 0,
      disbursements: 0,
    },
  });

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
  // ✅ Selected Cost Plan for measurement assignment
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string>("");

  // ============================================
  // RecalcEngine (AFTER state declarations)
  // ============================================
  const recalcEngine = useMemo(() => new RecalcEngine(
    (costPlanId, computed, total) => {
      setComputedItems(prev => {
        const filtered = prev.filter(item => item.costPlanId !== costPlanId);
        return [...filtered, ...computed];
      });
    }
  ), []);

  // ============================================
  // Recalculate on data change
  // ============================================
  useEffect(() => {
    if (measurementItems.length === 0 || costPlans.length === 0) return;
    recalcEngine.recalculateProject(
      'current-project',
      costPlans,
      measurementItems,
      {}, // elementRates (future)
      {}  // projectRates (future)
    );
  }, [measurementItems, costPlans, recalcEngine]);

  // ============================================
  // AUTO-GENERATE COST PLAN COMPONENTS (legacy)
  // ============================================
  useEffect(() => {
    const wallComponents = generateWallCostPlanComponents(wallMeasurements, wallTypes);
    const slabComponents = generateSlabCostPlanComponents(slabMeasurements, slabTypes);
    const beamComponents = generateBeamCostPlanComponents(beamMeasurements, beamTypes);
    const columnComponents = generateColumnCostPlanComponents(columnMeasurements, columnTypes);
    const surfaceBedComponents = generateSurfaceBedCostPlanComponents(surfaceBedMeasurements, surfaceBedTypes);
    const groundBeamComponents = generateGroundBeamCostPlanComponents(groundBeamMeasurements, groundBeamTypes);
    const padFootingComponents = generatePadFootingCostPlanComponents(padFootingMeasurements, padFootingTypes);
    const openingComponents = generateOpeningCostPlanComponents(openingMeasurements, openingTypes);

    const allComponents = [
      ...wallComponents,
      ...slabComponents,
      ...beamComponents,
      ...columnComponents,
      ...surfaceBedComponents,
      ...groundBeamComponents,
      ...padFootingComponents,
      ...openingComponents,
    ];

    setCostPlanComponents(allComponents);
    console.log("Generated cost plan components:", allComponents.length);
  }, [
    wallMeasurements,
    wallTypes,
    slabMeasurements,
    slabTypes,
    beamMeasurements,
    beamTypes,
    columnMeasurements,
    columnTypes,
    surfaceBedMeasurements,
    surfaceBedTypes,
    groundBeamMeasurements,
    groundBeamTypes,
    padFootingMeasurements,
    padFootingTypes,
    openingMeasurements,
    openingTypes,
  ]);

  // ============================================
  // LOCAL STORAGE PERSISTENCE
  // ============================================
  useEffect(() => {
    const savedData = loadProjectData();
    if (savedData) {
      setBeamTypes(savedData.beamTypes || []);
      setBeamMeasurements(savedData.beamMeasurements || []);
      setSurfaceBedTypes(savedData.surfaceBedTypes || []);
      setSurfaceBedMeasurements(savedData.surfaceBedMeasurements || []);
      setPadFootingTypes(savedData.padFootingTypes || []);
      setPadFootingMeasurements(savedData.padFootingMeasurements || []);
      setGroundBeamTypes(savedData.groundBeamTypes || []);
      setGroundBeamMeasurements(savedData.groundBeamMeasurements || []);
      setColumnTypes(savedData.columnTypes || []);
      setColumnMeasurements(savedData.columnMeasurements || []);
      setWallTypes(savedData.wallTypes || []);
      setWallMeasurements(savedData.wallMeasurements || []);
      setSlabTypes(savedData.slabTypes || []);
      setSlabMeasurements(savedData.slabMeasurements || []);
      setOpeningTypes(savedData.openingTypes || []);
      setOpeningMeasurements(savedData.openingMeasurements || []);
      setRates(savedData.rates || {});
      setCostPlanComponents(savedData.costPlanComponents || []);
      // Restore executive input
      if (savedData.executiveInput) {
      setExecutiveInput(savedData.executiveInput);
      setCostPlans(savedData.costPlans || []);
      }
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
      executiveInput,
      costPlans,
    };
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
    executiveInput, // <-- ADDED
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
      // Reset executive input
      setExecutiveInput({
        projectName: "My Project",
        baseDate: new Date().toISOString().split("T")[0],
        buildingArea: 0,
        specialistServices: [],
        preliminaries: 0,
        contingency: 0,
        escalations: {
          preConstructionMonths: 6,
          preConstructionRate: 5,
          constructionMonths: 12,
          constructionRate: 8,
        },
        professionalFees: {
          coreConsultants: 0,
          specialistConsultants: 0,
          disbursements: 0,
        },
      });
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
  // BUILD COST PLANS FROM COMPONENTS
  // ============================================
  const buildCostPlans = (): CostPlan[] => {
    const items: CostPlanItem[] = costPlanComponents.map((comp, index) => ({
      id: `item-${index}`,
      description: comp.description,
      elementCode: comp.elementalElementId || "uncategorised",
      quantity: comp.qty,
      unit: comp.unit,
      rate: comp.rate || 0,
      amount: (comp.qty || 0) * (comp.rate || 0),
    }));

    const costPlan: CostPlan = {
      id: "cp-1",
      name: "Main Cost Plan",
      type: "floor",
      gfa_m2: executiveInput.buildingArea || 0,
      items,
    };

    return [costPlan];
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
    if (!newSlabMeas.mark.trim() || newSlabMeas.slabTypeId === 0 ||
        !newSlabMeas.length || newSlabMeas.length <= 0 ||
        !newSlabMeas.width || newSlabMeas.width <= 0 ||
        !newSlabMeas.quantity || newSlabMeas.quantity <= 0) {
      return;
    }

    const length = Number(newSlabMeas.length) || 0;
    const width = Number(newSlabMeas.width) || 0;
    const quantity = Number(newSlabMeas.quantity) || 0;
    const area = length * width * quantity;

    const measurement = {
      id: Date.now(),
      ...newSlabMeas,
      area,
      elementalSectionId: "structural-frame",
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
    if (!newWallMeas.mark.trim() || newWallMeas.wallTypeId === 0 || !newWallMeas.length || newWallMeas.length <= 0 || !newWallMeas.height || newWallMeas.height <= 0) {
      return;
    }

    const area = newWallMeas.length * newWallMeas.height;
    const wallLocation = newWallMeas.wallLocation || "Internal Division";

    const measurement = {
      id: Date.now(),
      ...newWallMeas,
      area,
      wallLocation,
      elementalSectionId: "internal-divisions",
      elementalElementId: "walls",
      costPlanId: selectedCostPlanId,
    };

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
  generateBeamBoqItems(beamMeasurements, beamTypes, masterBoqItems);

  // ---------- SURFACE BEDS ----------
  generateSurfaceBedBoqItems(surfaceBedMeasurements, surfaceBedTypes, masterBoqItems);

  // ---------- PAD FOOTINGS ----------
  generatePadFootingBoqItems(padFootingMeasurements, padFootingTypes, masterBoqItems);

  // ---------- GROUND BEAMS ----------
  generateGroundBeamBoqItems(groundBeamMeasurements, groundBeamTypes, masterBoqItems);

  // ---------- COLUMNS ----------
  generateColumnBoqItems(columnMeasurements, columnTypes, masterBoqItems);

  // ---------- WALLS ----------
  generateWallBoqItems(wallMeasurements, wallTypes, masterBoqItems);

  // ---------- SLABS ----------
  generateSlabBoqItems(slabMeasurements, slabTypes, masterBoqItems);

  // ---------- OPENINGS ----------
  generateOpeningBoqItems(openingMeasurements, openingTypes, masterBoqItems);

  // ============================================
  // TAB STATE
  // ============================================
  const [activeTab, setActiveTab] = useState<"dashboard" | "measurement" | "costplans" | "boq" | "reports" | "settings">("dashboard");

  // ============================================
  // TAB STYLES
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
        <button style={tabButtonStyle(activeTab === "costplans")} onClick={() => setActiveTab("costplans")}>
        Cost Plans
        </button>
      </div>

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
                costPlans,
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
                costPlans,
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
                costPlans,
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
                costPlans,
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
                costPlans,
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
                costPlans,
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
                costPlans,
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
                costPlans,
              },
            }}
          />
        )}

        {activeTab === "costplans" && (
  <CostPlanManager
    costPlans={costPlans}
    onAdd={(newCp) => {
      // Add new Cost Plan with generated ID
      const id = `cp-${Date.now()}`;
      setCostPlans([...costPlans, { id, ...newCp }]);
    }}
    onEdit={(id, updatedCp) => {
      setCostPlans(costPlans.map(cp =>
        cp.id === id ? { ...cp, ...updatedCp, updatedAt: new Date().toISOString() } : cp
      ));
    }}
    onDelete={(id) => {
      setCostPlans(costPlans.filter(cp => cp.id !== id));
    }}
    styles={styles}
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
          <ReportsTab
            costPlans={buildCostPlans()}
            executiveInput={executiveInput}
            setExecutiveInput={setExecutiveInput}
            styles={styles}
          />
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