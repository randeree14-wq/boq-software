"use client";

import { useState } from "react";

// ------------------------------
// Types
// ------------------------------
type BeamType = {
  id: number;
  name: string;
  width: number;
  depth: number;
  reinfKg: number;
  formworkFinish: string;
  concreteClass: string;
};

type BeamMeasurement = {
  id: number;
  mark: string;
  beamTypeId: number;
  length: number;
};

type SurfaceBedType = {
  id: number;
  name: string;
  category: string;
  thickness: number;
  concreteClass: string;
  meshType: string;
  dpm: boolean;
  soilPoison: boolean;
  layer1Material: string;
  layer1Thickness: number;
  layer2Material: string;
  layer2Thickness: number;
  layer3Material: string;
  layer3Thickness: number;
  powerfloat: boolean;
  screedRequired: boolean;
  screedThickness: number;
  screedType: string;
  tileRequired: boolean;
  tilePcSum: number;
};

type SurfaceBedMeasurement = {
  id: number;
  mark: string;
  surfaceBedTypeId: number;
  area: number;
};

type PadFootingType = {
  id: number;
  name: string;
  padLength: number;
  padWidth: number;
  padDepth: number;
  excavationLength: number;
  excavationWidth: number;
  excavationDepth: number;
  concreteClass: string;
  reinfKg: number;
  formworkRequired: boolean;
  blindingRequired: boolean;
  blindingThickness: number;
  soilPoison: boolean;
  backfill: boolean;
};

type PadFootingMeasurement = {
  id: number;
  mark: string;
  padFootingTypeId: number;
  quantity: number;
};

type GroundBeamType = {
  id: number;
  name: string;
  trenchWidth: number;
  trenchDepth: number;
  beamWidth: number;
  beamDepth: number;
  concreteClass: string;
  reinfKgPerM3: number;
  formworkRequired: boolean;
  blindingRequired: boolean;
  blindingThickness: number;
  backfillRequired: boolean;
  dpcRequired: boolean;
  soilPoisonRequired: boolean;
};

type GroundBeamMeasurement = {
  id: number;
  mark: string;
  groundBeamTypeId: number;
  length: number;
};

type ColumnType = {
  id: number;
  name: string;
  width: number;
  depth: number;
  height: number;
  concreteClass: string;
  reinfKgPerM3: number;
  formworkRequired: boolean;
  formworkFinish: string;
};

type ColumnMeasurement = {
  id: number;
  mark: string;
  columnTypeId: number;
  quantity: number;
};

type BoqItem = {
  item: string;
  unit: string;
  qty: number;
};

// ------------------------------
// Helpers
// ------------------------------
function addToBoqItem(
  boq: Record<string, BoqItem>,
  itemName: string,
  unit: string,
  qty: number
) {
  if (!boq[itemName]) {
    boq[itemName] = { item: itemName, unit, qty: 0 };
  }
  boq[itemName].qty += qty;
}

function addLayerToBoq(
  boq: Record<string, BoqItem>,
  material: string,
  thickness: number,
  area: number
) {
  if (material && thickness > 0) {
    addToBoqItem(boq, `${thickness}mm ${material} compacted`, "m²", area);
  }
}

// ------------------------------
// Custom hook for form state
// ------------------------------
function useFormState<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const reset = () => setValues(initialState);
  const update = (partial: Partial<T>) => setValues((prev) => ({ ...prev, ...partial }));
  return { values, update, reset };
}

// ------------------------------
// Styles
// ------------------------------
const pageStyle = {
  padding: "30px",
  fontFamily: "Arial",
  maxWidth: "1400px",
  margin: "0 auto",
  backgroundColor: "#f4f6f8",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
  marginBottom: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "20px",
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

// ------------------------------
// Main Component
// ------------------------------
export default function Home() {
  // ---------- Beam ----------
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

  // ---------- Surface Bed ----------
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

  // ---------- Pad Footing ----------
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

  // ---------- Ground Beam ----------
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

  // ---------- Column ----------
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

  // ------------------------------
  // Handlers: Beam
  // ------------------------------
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
    if (!newBeamMeas.mark.trim() || newBeamMeas.beamTypeId === 0) return;
    setBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newBeamMeas }]);
    resetBeamMeas();
  }

  // ------------------------------
  // Handlers: Surface Bed
  // ------------------------------
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
    if (!newSurfaceBedMeas.mark.trim() || newSurfaceBedMeas.surfaceBedTypeId === 0) return;
    setSurfaceBedMeasurements((prev) => [...prev, { id: Date.now(), ...newSurfaceBedMeas }]);
    resetSurfaceBedMeas();
  }

  // ------------------------------
  // Handlers: Pad Footing
  // ------------------------------
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
    if (!newPadFootingMeas.mark.trim() || newPadFootingMeas.padFootingTypeId === 0) return;
    setPadFootingMeasurements((prev) => [...prev, { id: Date.now(), ...newPadFootingMeas }]);
    resetPadFootingMeas();
  }

  // ------------------------------
  // Handlers: Ground Beam
  // ------------------------------
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
    if (!newGroundBeamMeas.mark.trim() || newGroundBeamMeas.groundBeamTypeId === 0) return;
    setGroundBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newGroundBeamMeas }]);
    resetGroundBeamMeas();
  }

  // ------------------------------
  // Handlers: Column
  // ------------------------------
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
    if (!newColumnMeas.mark.trim() || newColumnMeas.columnTypeId === 0) return;
    setColumnMeasurements((prev) => [...prev, { id: Date.now(), ...newColumnMeas }]);
    resetColumnMeas();
  }

  // ------------------------------
  // BOQ Calculations
  // ------------------------------
  const beamBoqItems: Record<string, BoqItem> = {};
  beamMeasurements.forEach((m) => {
    const beam = beamTypes.find((b) => b.id === m.beamTypeId);
    if (!beam) return;
    const widthM = beam.width / 1000;
    const depthM = beam.depth / 1000;
    const concrete = widthM * depthM * m.length;
    const formwork = m.length * (2 * depthM + widthM);
    const reinforcement = (concrete * beam.reinfKg) / 1000;
    addToBoqItem(beamBoqItems, `${beam.concreteClass} concrete in beams`, "m³", concrete);
    addToBoqItem(beamBoqItems, `${beam.formworkFinish} formwork to beams`, "m²", formwork);
    addToBoqItem(beamBoqItems, "Reinforcement in beams", "t", reinforcement);
  });

  const surfaceBedBoqItems: Record<string, BoqItem> = {};
  surfaceBedMeasurements.forEach((m) => {
    const sb = surfaceBedTypes.find((s) => s.id === m.surfaceBedTypeId);
    if (!sb) return;
    const concreteVol = m.area * (sb.thickness / 1000);
    addLayerToBoq(surfaceBedBoqItems, sb.layer1Material, sb.layer1Thickness, m.area);
    addLayerToBoq(surfaceBedBoqItems, sb.layer2Material, sb.layer2Thickness, m.area);
    addLayerToBoq(surfaceBedBoqItems, sb.layer3Material, sb.layer3Thickness, m.area);
    if (sb.dpm) addToBoqItem(surfaceBedBoqItems, "DPM under surface beds", "m²", m.area);
    if (sb.soilPoison) addToBoqItem(surfaceBedBoqItems, "Soil poisoning under surface beds", "m²", m.area);
    if (sb.meshType !== "None") addToBoqItem(surfaceBedBoqItems, `${sb.meshType} mesh reinforcement`, "m²", m.area);
    addToBoqItem(surfaceBedBoqItems, `${sb.concreteClass} concrete in surface beds`, "m³", concreteVol);
    if (sb.screedRequired) addToBoqItem(surfaceBedBoqItems, `${sb.screedThickness}mm screed ${sb.screedType}`, "m²", m.area);
    if (sb.tileRequired) addToBoqItem(surfaceBedBoqItems, `Tiles PC Sum R${sb.tilePcSum}/m²`, "m²", m.area);
    if (sb.powerfloat) addToBoqItem(surfaceBedBoqItems, "Powerfloat finish", "m²", m.area);
  });

  const padFootingBoqItems: Record<string, BoqItem> = {};
  padFootingMeasurements.forEach((m) => {
    const pf = padFootingTypes.find((p) => p.id === m.padFootingTypeId);
    if (!pf) return;
    const qty = m.quantity;
    const padConcrete = (pf.padLength / 1000) * (pf.padWidth / 1000) * (pf.padDepth / 1000) * qty;
    const excavationVol = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * (pf.excavationDepth / 1000) * qty;
    const reinforcementTonnes = (padConcrete * pf.reinfKg) / 1000;
    addToBoqItem(padFootingBoqItems, `${pf.concreteClass} concrete in pad footings`, "m³", padConcrete);
    addToBoqItem(padFootingBoqItems, "Excavation for pad footings", "m³", excavationVol);
    addToBoqItem(padFootingBoqItems, "Reinforcement in pad footings", "t", reinforcementTonnes);
    if (pf.formworkRequired) {
      const formwork = 2 * ((pf.padLength / 1000) + (pf.padWidth / 1000)) * (pf.padDepth / 1000) * qty;
      addToBoqItem(padFootingBoqItems, "Formwork to pad footings", "m²", formwork);
    }
    if (pf.blindingRequired) {
      const blinding = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * (pf.blindingThickness / 1000) * qty;
      addToBoqItem(padFootingBoqItems, `${pf.blindingThickness}mm blinding under pad footings`, "m³", blinding);
    }
    if (pf.soilPoison) {
      const soilPoisonArea = (pf.excavationLength / 1000) * (pf.excavationWidth / 1000) * qty;
      addToBoqItem(padFootingBoqItems, "Soil poisoning to pad footings", "m²", soilPoisonArea);
    }
    if (pf.backfill) {
      const backfillVol = excavationVol - padConcrete;
      addToBoqItem(padFootingBoqItems, "Backfill to pad footings", "m³", backfillVol);
    }
  });

  const groundBeamBoqItems: Record<string, BoqItem> = {};
  groundBeamMeasurements.forEach((m) => {
    const gb = groundBeamTypes.find((g) => g.id === m.groundBeamTypeId);
    if (!gb) return;
    const length = m.length;
    const trenchVol = (gb.trenchWidth / 1000) * (gb.trenchDepth / 1000) * length;
    const concreteVol = (gb.beamWidth / 1000) * (gb.beamDepth / 1000) * length;
    const reinforcementTonnes = (concreteVol * gb.reinfKgPerM3) / 1000;
    addToBoqItem(groundBeamBoqItems, "Excavation for ground beams", "m³", trenchVol);
    addToBoqItem(groundBeamBoqItems, `${gb.concreteClass} concrete in ground beams`, "m³", concreteVol);
    addToBoqItem(groundBeamBoqItems, "Reinforcement in ground beams", "t", reinforcementTonnes);
    if (gb.formworkRequired) {
      const formwork = (gb.beamDepth / 1000) * length * 2;
      addToBoqItem(groundBeamBoqItems, "Formwork to sides of ground beams", "m²", formwork);
    }
    if (gb.blindingRequired) {
      const blindingVol = (gb.beamWidth / 1000) * (gb.blindingThickness / 1000) * length;
      addToBoqItem(groundBeamBoqItems, `${gb.blindingThickness}mm blinding under ground beams`, "m³", blindingVol);
    }
    if (gb.backfillRequired) {
      const backfillVol = trenchVol - concreteVol;
      addToBoqItem(groundBeamBoqItems, "Backfill to ground beams", "m³", backfillVol);
    }
    if (gb.dpcRequired) {
      const dpcArea = (gb.beamWidth / 1000) * length;
      addToBoqItem(groundBeamBoqItems, "DPC to ground beams", "m²", dpcArea);
    }
    if (gb.soilPoisonRequired) {
      const soilPoisonArea = (gb.trenchWidth / 1000) * length;
      addToBoqItem(groundBeamBoqItems, "Soil poisoning under ground beams", "m²", soilPoisonArea);
    }
  });

  const columnBoqItems: Record<string, BoqItem> = {};
  columnMeasurements.forEach((m) => {
    const col = columnTypes.find((c) => c.id === m.columnTypeId);
    if (!col) return;
    const qty = m.quantity;
    const concreteVol = (col.width / 1000) * (col.depth / 1000) * (col.height / 1000) * qty;
    const reinforcementTonnes = (concreteVol * col.reinfKgPerM3) / 1000;
    addToBoqItem(columnBoqItems, `${col.concreteClass} concrete in columns`, "m³", concreteVol);
    addToBoqItem(columnBoqItems, "Reinforcement in columns", "t", reinforcementTonnes);
    if (col.formworkRequired) {
      const perimeter = 2 * ((col.width / 1000) + (col.depth / 1000));
      const formworkArea = perimeter * (col.height / 1000) * qty;
      addToBoqItem(columnBoqItems, `${col.formworkFinish} formwork to columns`, "m²", formworkArea);
    }
  });

  const finalBoqItems: Record<string, BoqItem> = {};
  const addToFinal = (items: Record<string, BoqItem>) => {
    Object.values(items).forEach((row) => {
      addToBoqItem(finalBoqItems, row.item, row.unit, row.qty);
    });
  };
  addToFinal(beamBoqItems);
  addToFinal(surfaceBedBoqItems);
  addToFinal(padFootingBoqItems);
  addToFinal(groundBeamBoqItems);
  addToFinal(columnBoqItems);

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <main style={pageStyle}>
      <h1>BOQ Measurement Software</h1>

      {/* BOQ Summary */}
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
          {Object.values(finalBoqItems).map((row) => {
            return (
              <tr key={row.item}>
                <td style={tdStyle}>{row.item}</td>
                <td style={tdStyle}>{row.unit}</td>
                <td style={tdStyle}>{row.qty.toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ==================== BEAM MODULE ==================== */}
      <div style={cardStyle}>
        <h1>Beam Module</h1>
        <h2>Beam Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newBeam.name} onChange={(e) => updateBeam({ name: e.target.value })} />
          <input type="number" placeholder="Width mm" value={newBeam.width} onChange={(e) => updateBeam({ width: Number(e.target.value) })} />
          <input type="number" placeholder="Depth mm" value={newBeam.depth} onChange={(e) => updateBeam({ depth: Number(e.target.value) })} />
          <input type="number" placeholder="Reinf kg/m³" value={newBeam.reinfKg} onChange={(e) => updateBeam({ reinfKg: Number(e.target.value) })} />
          <select value={newBeam.formworkFinish} onChange={(e) => updateBeam({ formworkFinish: e.target.value })}>
            <option>Smooth</option><option>Rough</option><option>Special</option>
          </select>
          <select value={newBeam.concreteClass} onChange={(e) => updateBeam({ concreteClass: e.target.value })}>
            <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
          </select>
          <button onClick={saveBeamType}>{editingBeamId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Width</th>
              <th style={thStyle}>Depth</th>
              <th style={thStyle}>Reinf</th>
              <th style={thStyle}>Formwork</th>
              <th style={thStyle}>Concrete</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beamTypes.map((beam) => {
              return (
                <tr key={beam.id}>
                  <td style={tdStyle}>{beam.name}</td>
                  <td style={tdStyle}>{beam.width}</td>
                  <td style={tdStyle}>{beam.depth}</td>
                  <td style={tdStyle}>{beam.reinfKg}</td>
                  <td style={tdStyle}>{beam.formworkFinish}</td>
                  <td style={tdStyle}>{beam.concreteClass}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editBeamType(beam.id)}>Edit</button>
                    <button onClick={() => deleteBeamType(beam.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <hr />
        <h2>Beam Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newBeamMeas.mark} onChange={(e) => updateBeamMeas({ mark: e.target.value })} />
          <select value={newBeamMeas.beamTypeId} onChange={(e) => updateBeamMeas({ beamTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {beamTypes.map((beam) => {
              return <option key={beam.id} value={beam.id}>{beam.name}</option>;
            })}
          </select>
          <input type="number" placeholder="Length (m)" value={newBeamMeas.length} onChange={(e) => updateBeamMeas({ length: Number(e.target.value) })} />
          <button onClick={addBeamMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Beam Type</th>
              <th style={thStyle}>Length</th>
            </tr>
          </thead>
          <tbody>
            {beamMeasurements.map((m) => {
              const beam = beamTypes.find(b => b.id === m.beamTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{beam?.name}</td>
                  <td style={tdStyle}>{m.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ==================== SURFACE BED MODULE ==================== */}
      <div style={cardStyle}>
        <h1>Surface Bed Module</h1>
        <h2>Surface Bed Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newSurfaceBed.name} onChange={(e) => updateSurfaceBed({ name: e.target.value })} />
          <select value={newSurfaceBed.category} onChange={(e) => updateSurfaceBed({ category: e.target.value })}>
            <option>Internal</option><option>External</option><option>Wet Area</option><option>Balcony</option><option>Roof Slab</option>
          </select>
          <input type="number" placeholder="Thickness mm" value={newSurfaceBed.thickness} onChange={(e) => updateSurfaceBed({ thickness: Number(e.target.value) })} />
          <select value={newSurfaceBed.concreteClass} onChange={(e) => updateSurfaceBed({ concreteClass: e.target.value })}>
            <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
          </select>
          <select value={newSurfaceBed.meshType} onChange={(e) => updateSurfaceBed({ meshType: e.target.value })}>
            <option>None</option><option>Ref193</option><option>Ref245</option><option>Ref395</option>
          </select>
          <label><input type="checkbox" checked={newSurfaceBed.dpm} onChange={(e) => updateSurfaceBed({ dpm: e.target.checked })} /> DPM</label>
          <label><input type="checkbox" checked={newSurfaceBed.soilPoison} onChange={(e) => updateSurfaceBed({ soilPoison: e.target.checked })} /> Soil Poison</label>
          <h3>Layerworks</h3>
          <select value={newSurfaceBed.layer1Material} onChange={(e) => updateSurfaceBed({ layer1Material: e.target.value })}>
            <option value="">No Layer 1</option><option>G5</option><option>G6</option><option>G7</option>
          </select>
          <input type="number" placeholder="Layer1 thick" value={newSurfaceBed.layer1Thickness} onChange={(e) => updateSurfaceBed({ layer1Thickness: Number(e.target.value) })} />
          <select value={newSurfaceBed.layer2Material} onChange={(e) => updateSurfaceBed({ layer2Material: e.target.value })}>
            <option value="">No Layer 2</option><option>G5</option><option>G6</option><option>G7</option>
          </select>
          <input type="number" placeholder="Layer2 thick" value={newSurfaceBed.layer2Thickness} onChange={(e) => updateSurfaceBed({ layer2Thickness: Number(e.target.value) })} />
          <select value={newSurfaceBed.layer3Material} onChange={(e) => updateSurfaceBed({ layer3Material: e.target.value })}>
            <option value="">No Layer 3</option><option>G5</option><option>G6</option><option>G7</option>
          </select>
          <input type="number" placeholder="Layer3 thick" value={newSurfaceBed.layer3Thickness} onChange={(e) => updateSurfaceBed({ layer3Thickness: Number(e.target.value) })} />
          <h3>Finishes</h3>
          <label><input type="checkbox" checked={newSurfaceBed.powerfloat} onChange={(e) => updateSurfaceBed({ powerfloat: e.target.checked })} /> Powerfloat</label>
          <label><input type="checkbox" checked={newSurfaceBed.screedRequired} onChange={(e) => updateSurfaceBed({ screedRequired: e.target.checked })} /> Screed</label>
          <input type="number" placeholder="Screed thick" value={newSurfaceBed.screedThickness} onChange={(e) => updateSurfaceBed({ screedThickness: Number(e.target.value) })} />
          <select value={newSurfaceBed.screedType} onChange={(e) => updateSurfaceBed({ screedType: e.target.value })}>
            <option>Normal</option><option>To Falls</option>
          </select>
          <label><input type="checkbox" checked={newSurfaceBed.tileRequired} onChange={(e) => updateSurfaceBed({ tileRequired: e.target.checked })} /> Tiles</label>
          <input type="number" placeholder="Tile PC Sum R/m²" value={newSurfaceBed.tilePcSum} onChange={(e) => updateSurfaceBed({ tilePcSum: Number(e.target.value) })} />
          <button onClick={saveSurfaceBedType}>{editingSurfaceBedId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Thick</th>
              <th style={thStyle}>Concrete</th>
              <th style={thStyle}>Mesh</th>
              <th style={thStyle}>DPM</th>
              <th style={thStyle}>Soil</th>
              <th style={thStyle}>Layer1</th>
              <th style={thStyle}>Layer2</th>
              <th style={thStyle}>Layer3</th>
              <th style={thStyle}>Powerfloat</th>
              <th style={thStyle}>Screed</th>
              <th style={thStyle}>Tiles</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {surfaceBedTypes.map((sb) => {
              return (
                <tr key={sb.id}>
                  <td style={tdStyle}>{sb.name}</td>
                  <td style={tdStyle}>{sb.category}</td>
                  <td style={tdStyle}>{sb.thickness}mm</td>
                  <td style={tdStyle}>{sb.concreteClass}</td>
                  <td style={tdStyle}>{sb.meshType}</td>
                  <td style={tdStyle}>{sb.dpm ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{sb.soilPoison ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{sb.layer1Material ? `${sb.layer1Thickness}mm ${sb.layer1Material}` : "-"}</td>
                  <td style={tdStyle}>{sb.layer2Material ? `${sb.layer2Thickness}mm ${sb.layer2Material}` : "-"}</td>
                  <td style={tdStyle}>{sb.layer3Material ? `${sb.layer3Thickness}mm ${sb.layer3Material}` : "-"}</td>
                  <td style={tdStyle}>{sb.powerfloat ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{sb.screedRequired ? `${sb.screedThickness}mm ${sb.screedType}` : "No"}</td>
                  <td style={tdStyle}>{sb.tileRequired ? `PC Sum R${sb.tilePcSum}/m²` : "No"}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editSurfaceBedType(sb.id)}>Edit</button>
                    <button onClick={() => deleteSurfaceBedType(sb.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <hr />
        <h2>Surface Bed Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newSurfaceBedMeas.mark} onChange={(e) => updateSurfaceBedMeas({ mark: e.target.value })} />
          <select value={newSurfaceBedMeas.surfaceBedTypeId} onChange={(e) => updateSurfaceBedMeas({ surfaceBedTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {surfaceBedTypes.map((sb) => {
              return <option key={sb.id} value={sb.id}>{sb.name}</option>;
            })}
          </select>
          <input type="number" placeholder="Area (m²)" value={newSurfaceBedMeas.area} onChange={(e) => updateSurfaceBedMeas({ area: Number(e.target.value) })} />
          <button onClick={addSurfaceBedMeasurement}>Add</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Surface Bed Type</th>
              <th style={thStyle}>Area</th>
            </tr>
          </thead>
          <tbody>
            {surfaceBedMeasurements.map((m) => {
              const sb = surfaceBedTypes.find(s => s.id === m.surfaceBedTypeId);
              return (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.mark}</td>
                  <td style={tdStyle}>{sb?.name}</td>
                  <td style={tdStyle}>{m.area}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ==================== PAD FOOTING MODULE ==================== */}
      <div style={cardStyle}>
        <h1>Pad Footing Module</h1>
        <h2>Pad Footing Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newPadFooting.name} onChange={(e) => updatePadFooting({ name: e.target.value })} />
          <h3>Pad Size (mm)</h3>
          <input type="number" placeholder="Length" value={newPadFooting.padLength} onChange={(e) => updatePadFooting({ padLength: Number(e.target.value) })} />
          <input type="number" placeholder="Width" value={newPadFooting.padWidth} onChange={(e) => updatePadFooting({ padWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Depth" value={newPadFooting.padDepth} onChange={(e) => updatePadFooting({ padDepth: Number(e.target.value) })} />
          <h3>Excavation (mm)</h3>
          <input type="number" placeholder="Length" value={newPadFooting.excavationLength} onChange={(e) => updatePadFooting({ excavationLength: Number(e.target.value) })} />
          <input type="number" placeholder="Width" value={newPadFooting.excavationWidth} onChange={(e) => updatePadFooting({ excavationWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Depth" value={newPadFooting.excavationDepth} onChange={(e) => updatePadFooting({ excavationDepth: Number(e.target.value) })} />
          <select value={newPadFooting.concreteClass} onChange={(e) => updatePadFooting({ concreteClass: e.target.value })}>
            <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
          </select>
          <input type="number" placeholder="Reinf kg/m³" value={newPadFooting.reinfKg} onChange={(e) => updatePadFooting({ reinfKg: Number(e.target.value) })} />
          <label><input type="checkbox" checked={newPadFooting.formworkRequired} onChange={(e) => updatePadFooting({ formworkRequired: e.target.checked })} /> Formwork</label>
          <label><input type="checkbox" checked={newPadFooting.blindingRequired} onChange={(e) => updatePadFooting({ blindingRequired: e.target.checked })} /> Blinding</label>
          <input type="number" placeholder="Blinding thickness" value={newPadFooting.blindingThickness} onChange={(e) => updatePadFooting({ blindingThickness: Number(e.target.value) })} />
          <label><input type="checkbox" checked={newPadFooting.soilPoison} onChange={(e) => updatePadFooting({ soilPoison: e.target.checked })} /> Soil Poison</label>
          <label><input type="checkbox" checked={newPadFooting.backfill} onChange={(e) => updatePadFooting({ backfill: e.target.checked })} /> Backfill</label>
          <button onClick={savePadFootingType}>{editingPadFootingId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Pad Size</th>
              <th style={thStyle}>Excavation</th>
              <th style={thStyle}>Concrete</th>
              <th style={thStyle}>Reinf</th>
              <th style={thStyle}>Formwork</th>
              <th style={thStyle}>Blinding</th>
              <th style={thStyle}>Soil</th>
              <th style={thStyle}>Backfill</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {padFootingTypes.map((pf) => {
              return (
                <tr key={pf.id}>
                  <td style={tdStyle}>{pf.name}</td>
                  <td style={tdStyle}>{pf.padLength}x{pf.padWidth}x{pf.padDepth}</td>
                  <td style={tdStyle}>{pf.excavationLength}x{pf.excavationWidth}x{pf.excavationDepth}</td>
                  <td style={tdStyle}>{pf.concreteClass}</td>
                  <td style={tdStyle}>{pf.reinfKg}</td>
                  <td style={tdStyle}>{pf.formworkRequired ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{pf.blindingRequired ? `${pf.blindingThickness}mm` : "No"}</td>
                  <td style={tdStyle}>{pf.soilPoison ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{pf.backfill ? "Yes" : "No"}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editPadFootingType(pf.id)}>Edit</button>
                    <button onClick={() => deletePadFootingType(pf.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <hr />
        <h2>Pad Footing Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newPadFootingMeas.mark} onChange={(e) => updatePadFootingMeas({ mark: e.target.value })} />
          <select value={newPadFootingMeas.padFootingTypeId} onChange={(e) => updatePadFootingMeas({ padFootingTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {padFootingTypes.map((pf) => {
              return <option key={pf.id} value={pf.id}>{pf.name}</option>;
            })}
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
              const pf = padFootingTypes.find(p => p.id === m.padFootingTypeId);
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

      {/* ==================== GROUND BEAM MODULE ==================== */}
      <div style={cardStyle}>
        <h1>Ground Beam Module</h1>
        <h2>Ground Beam Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newGroundBeam.name} onChange={(e) => updateGroundBeam({ name: e.target.value })} />
          <input type="number" placeholder="Trench Width mm" value={newGroundBeam.trenchWidth} onChange={(e) => updateGroundBeam({ trenchWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Trench Depth mm" value={newGroundBeam.trenchDepth} onChange={(e) => updateGroundBeam({ trenchDepth: Number(e.target.value) })} />
          <input type="number" placeholder="Beam Width mm" value={newGroundBeam.beamWidth} onChange={(e) => updateGroundBeam({ beamWidth: Number(e.target.value) })} />
          <input type="number" placeholder="Beam Depth mm" value={newGroundBeam.beamDepth} onChange={(e) => updateGroundBeam({ beamDepth: Number(e.target.value) })} />
          <select value={newGroundBeam.concreteClass} onChange={(e) => updateGroundBeam({ concreteClass: e.target.value })}>
            <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
          </select>
          <input type="number" placeholder="Reinf kg/m³" value={newGroundBeam.reinfKgPerM3} onChange={(e) => updateGroundBeam({ reinfKgPerM3: Number(e.target.value) })} />
          <label><input type="checkbox" checked={newGroundBeam.formworkRequired} onChange={(e) => updateGroundBeam({ formworkRequired: e.target.checked })} /> Formwork</label>
          <label><input type="checkbox" checked={newGroundBeam.blindingRequired} onChange={(e) => updateGroundBeam({ blindingRequired: e.target.checked })} /> Blinding</label>
          <input type="number" placeholder="Blinding thickness mm" value={newGroundBeam.blindingThickness} onChange={(e) => updateGroundBeam({ blindingThickness: Number(e.target.value) })} />
          <label><input type="checkbox" checked={newGroundBeam.backfillRequired} onChange={(e) => updateGroundBeam({ backfillRequired: e.target.checked })} /> Backfill</label>
          <label><input type="checkbox" checked={newGroundBeam.dpcRequired} onChange={(e) => updateGroundBeam({ dpcRequired: e.target.checked })} /> DPC</label>
          <label><input type="checkbox" checked={newGroundBeam.soilPoisonRequired} onChange={(e) => updateGroundBeam({ soilPoisonRequired: e.target.checked })} /> Soil Poison</label>
          <button onClick={saveGroundBeamType}>{editingGroundBeamId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Trench (WxD)</th>
              <th style={thStyle}>Beam (WxD)</th>
              <th style={thStyle}>Concrete</th>
              <th style={thStyle}>Reinf</th>
              <th style={thStyle}>Formwork</th>
              <th style={thStyle}>Blinding</th>
              <th style={thStyle}>Backfill</th>
              <th style={thStyle}>DPC</th>
              <th style={thStyle}>Soil</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groundBeamTypes.map((gb) => {
              return (
                <tr key={gb.id}>
                  <td style={tdStyle}>{gb.name}</td>
                  <td style={tdStyle}>{gb.trenchWidth}x{gb.trenchDepth}</td>
                  <td style={tdStyle}>{gb.beamWidth}x{gb.beamDepth}</td>
                  <td style={tdStyle}>{gb.concreteClass}</td>
                  <td style={tdStyle}>{gb.reinfKgPerM3}</td>
                  <td style={tdStyle}>{gb.formworkRequired ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{gb.blindingRequired ? `${gb.blindingThickness}mm` : "No"}</td>
                  <td style={tdStyle}>{gb.backfillRequired ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{gb.dpcRequired ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{gb.soilPoisonRequired ? "Yes" : "No"}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editGroundBeamType(gb.id)}>Edit</button>
                    <button onClick={() => deleteGroundBeamType(gb.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <hr />
        <h2>Ground Beam Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newGroundBeamMeas.mark} onChange={(e) => updateGroundBeamMeas({ mark: e.target.value })} />
          <select value={newGroundBeamMeas.groundBeamTypeId} onChange={(e) => updateGroundBeamMeas({ groundBeamTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {groundBeamTypes.map((gb) => {
              return <option key={gb.id} value={gb.id}>{gb.name}</option>;
            })}
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
              const gb = groundBeamTypes.find(g => g.id === m.groundBeamTypeId);
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

      {/* ==================== COLUMN MODULE ==================== */}
      <div style={cardStyle}>
        <h1>Column Module</h1>
        <h2>Column Type Library</h2>
        <div style={formGridStyle}>
          <input placeholder="Name" value={newColumn.name} onChange={(e) => updateColumn({ name: e.target.value })} />
          <input type="number" placeholder="Width mm" value={newColumn.width} onChange={(e) => updateColumn({ width: Number(e.target.value) })} />
          <input type="number" placeholder="Depth mm" value={newColumn.depth} onChange={(e) => updateColumn({ depth: Number(e.target.value) })} />
          <input type="number" placeholder="Height mm" value={newColumn.height} onChange={(e) => updateColumn({ height: Number(e.target.value) })} />
          <select value={newColumn.concreteClass} onChange={(e) => updateColumn({ concreteClass: e.target.value })}>
            <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
          </select>
          <input type="number" placeholder="Reinf kg/m³" value={newColumn.reinfKgPerM3} onChange={(e) => updateColumn({ reinfKgPerM3: Number(e.target.value) })} />
          <label><input type="checkbox" checked={newColumn.formworkRequired} onChange={(e) => updateColumn({ formworkRequired: e.target.checked })} /> Formwork</label>
          <select value={newColumn.formworkFinish} onChange={(e) => updateColumn({ formworkFinish: e.target.value })}>
            <option>Smooth</option><option>Rough</option><option>Special</option>
          </select>
          <button onClick={saveColumnType}>{editingColumnId !== null ? "Update" : "Save"}</button>
        </div>
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Width</th>
              <th style={thStyle}>Depth</th>
              <th style={thStyle}>Height</th>
              <th style={thStyle}>Concrete</th>
              <th style={thStyle}>Reinf</th>
              <th style={thStyle}>Formwork</th>
              <th style={thStyle}>Finish</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {columnTypes.map((col) => {
              return (
                <tr key={col.id}>
                  <td style={tdStyle}>{col.name}</td>
                  <td style={tdStyle}>{col.width}mm</td>
                  <td style={tdStyle}>{col.depth}mm</td>
                  <td style={tdStyle}>{col.height}mm</td>
                  <td style={tdStyle}>{col.concreteClass}</td>
                  <td style={tdStyle}>{col.reinfKgPerM3}</td>
                  <td style={tdStyle}>{col.formworkRequired ? "Yes" : "No"}</td>
                  <td style={tdStyle}>{col.formworkFinish}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editColumnType(col.id)}>Edit</button>
                    <button onClick={() => deleteColumnType(col.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <hr />
        <h2>Column Measurements</h2>
        <div style={formGridStyle}>
          <input placeholder="Mark" value={newColumnMeas.mark} onChange={(e) => updateColumnMeas({ mark: e.target.value })} />
          <select value={newColumnMeas.columnTypeId} onChange={(e) => updateColumnMeas({ columnTypeId: Number(e.target.value) })}>
            <option value={0}>Select Type</option>
            {columnTypes.map((col) => {
              return <option key={col.id} value={col.id}>{col.name}</option>;
            })}
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
              const col = columnTypes.find(c => c.id === m.columnTypeId);
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
    </main>
  );
}