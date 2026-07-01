"use client";

import { useState } from "react";
import type { PadFootingType, PadFootingMeasurement, CostPlan } from "@/types/boq";

interface PadFootingModuleProps {
  padFootingTypes: PadFootingType[];
  setPadFootingTypes: React.Dispatch<React.SetStateAction<PadFootingType[]>>;
  editingPadFootingId: number | null;
  setEditingPadFootingId: React.Dispatch<React.SetStateAction<number | null>>;
  newPadFooting: Omit<PadFootingType, "id">;
  updatePadFooting: (partial: Partial<Omit<PadFootingType, "id">>) => void;
  resetPadFooting: () => void;
  padFootingMeasurements: PadFootingMeasurement[];
  setPadFootingMeasurements: React.Dispatch<React.SetStateAction<PadFootingMeasurement[]>>;
  newPadFootingMeas: Omit<PadFootingMeasurement, "id">;
  updatePadFootingMeas: (partial: Partial<Omit<PadFootingMeasurement, "id">>) => void;
  resetPadFootingMeas: () => void;
  editingPadFootingMeasurementId: number | null;
  setEditingPadFootingMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
  costPlans: CostPlan[]; // NEW
}

export default function PadFootingModule({
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
  styles,
  costPlans,
}: PadFootingModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string>("");

  // SAFEGUARD: Safe versions of all props
  const safeNewPadFooting = {
    name: newPadFooting?.name || "",
    padLength: newPadFooting?.padLength || 0,
    padWidth: newPadFooting?.padWidth || 0,
    padDepth: newPadFooting?.padDepth || 0,
    excavationLength: newPadFooting?.excavationLength || 0,
    excavationWidth: newPadFooting?.excavationWidth || 0,
    excavationDepth: newPadFooting?.excavationDepth || 0,
    concreteClass: newPadFooting?.concreteClass || "30MPa/19mm",
    reinfKg: newPadFooting?.reinfKg || 0,
    formworkRequired: newPadFooting?.formworkRequired ?? true,
    blindingRequired: newPadFooting?.blindingRequired ?? true,
    blindingThickness: newPadFooting?.blindingThickness || 0,
    soilPoison: newPadFooting?.soilPoison ?? false,
    backfill: newPadFooting?.backfill ?? true,
    workingSpaceRequired: newPadFooting?.workingSpaceRequired ?? false,
    riskOfCollapseRequired: newPadFooting?.riskOfCollapseRequired ?? false,
  };

  const safeNewPadFootingMeas = {
    mark: newPadFootingMeas?.mark || "",
    padFootingTypeId: newPadFootingMeas?.padFootingTypeId || 0,
    quantity: newPadFootingMeas?.quantity || 0,
  };

  const safePadFootingTypes = padFootingTypes || [];
  const safePadFootingMeasurements = padFootingMeasurements || [];

  const savePadFootingType = () => {
    if (!safeNewPadFooting.name.trim()) return;
    if (editingPadFootingId !== null) {
      setPadFootingTypes((prev) => prev.map((pf) => (pf.id === editingPadFootingId ? { ...pf, ...safeNewPadFooting } : pf)));
      setEditingPadFootingId(null);
    } else {
      setPadFootingTypes((prev) => [...prev, { id: Date.now(), ...safeNewPadFooting }]);
    }
    resetPadFooting();
  };

  const editPadFootingType = (id: number) => {
    const pf = safePadFootingTypes.find((p) => p.id === id);
    if (pf) {
      updatePadFooting(pf);
      setEditingPadFootingId(id);
    }
  };

  const deletePadFootingType = (id: number) => {
    setPadFootingTypes((prev) => prev.filter((pf) => pf.id !== id));
    setPadFootingMeasurements((prev) => prev.filter((m) => m.padFootingTypeId !== id));
  };

  const addPadFootingMeasurement = () => {
    if (!selectedCostPlanId) {
      alert("Please select a Cost Plan first.");
      return;
    }
    if (!safeNewPadFootingMeas.mark.trim() || safeNewPadFootingMeas.padFootingTypeId === 0 || !safeNewPadFootingMeas.quantity || safeNewPadFootingMeas.quantity <= 0) return;
    const measurement = {
      id: Date.now(),
      ...safeNewPadFootingMeas,
      elementalSectionId: "substructure",
      elementalElementId: "pad-footings",
      costPlanId: selectedCostPlanId,
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
  };

  const editPadFootingMeasurement = (id: number) => {
    const measurement = safePadFootingMeasurements.find((m) => m.id === id);
    if (measurement) {
      updatePadFootingMeas(measurement);
      setEditingPadFootingMeasurementId(id);
    }
  };

  const deletePadFootingMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setPadFootingMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingPadFootingMeasurementId === id) {
        setEditingPadFootingMeasurementId(null);
        resetPadFootingMeas();
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Pad Footing Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewPadFooting.name} onChange={(e) => updatePadFooting({ name: e.target.value })} />
        <input type="number" placeholder="Pad length (mm) e.g., 1200" value={safeNewPadFooting.padLength || ''} onChange={(e) => updatePadFooting({ padLength: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Pad width (mm) e.g., 1000" value={safeNewPadFooting.padWidth || ''} onChange={(e) => updatePadFooting({ padWidth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Pad Depth (mm) e.g., 300" value={safeNewPadFooting.padDepth || ''} onChange={(e) => updatePadFooting({ padDepth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Excavation Length (mm) e.g., 1800" value={safeNewPadFooting.excavationLength || ''} onChange={(e) => updatePadFooting({ excavationLength: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Excavation Width (mm) e.g., 1800" value={safeNewPadFooting.excavationWidth || ''} onChange={(e) => updatePadFooting({ excavationWidth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Excavation Depth (mm) e.g., 800" value={safeNewPadFooting.excavationDepth || ''} onChange={(e) => updatePadFooting({ excavationDepth: Number(e.target.value) || 0 })} />
        <select value={safeNewPadFooting.concreteClass} onChange={(e) => updatePadFooting({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option><option>40MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinforcement (kg/m³) e.g., 150" value={safeNewPadFooting.reinfKg || ''} onChange={(e) => updatePadFooting({ reinfKg: Number(e.target.value) || 0 })} />
        <label><input type="checkbox" checked={safeNewPadFooting.formworkRequired} onChange={(e) => updatePadFooting({ formworkRequired: e.target.checked })} /> Formwork required</label>
        <label><input type="checkbox" checked={safeNewPadFooting.blindingRequired} onChange={(e) => updatePadFooting({ blindingRequired: e.target.checked })} /> Blinding required</label>
        {safeNewPadFooting.blindingRequired && (
          <input type="number" placeholder="Blinding thickness (mm) e.g., 50" value={safeNewPadFooting.blindingThickness || ''} onChange={(e) => updatePadFooting({ blindingThickness: Number(e.target.value) || 0 })} />
        )}
        <label><input type="checkbox" checked={safeNewPadFooting.soilPoison} onChange={(e) => updatePadFooting({ soilPoison: e.target.checked })} /> Soil poison</label>
        <label><input type="checkbox" checked={safeNewPadFooting.backfill} onChange={(e) => updatePadFooting({ backfill: e.target.checked })} /> Backfill required</label>
        <label><input type="checkbox" checked={safeNewPadFooting.workingSpaceRequired} onChange={(e) => updatePadFooting({ workingSpaceRequired: e.target.checked })} /> Working space</label>
        <label><input type="checkbox" checked={safeNewPadFooting.riskOfCollapseRequired} onChange={(e) => updatePadFooting({ riskOfCollapseRequired: e.target.checked })} /> Risk of collapse</label>
        <button onClick={savePadFootingType}>{editingPadFootingId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Pad L</th><th style={thStyle}>Pad W</th><th style={thStyle}>Pad D</th>
          <th style={thStyle}>Exc L</th><th style={thStyle}>Exc W</th><th style={thStyle}>Exc D</th>
          <th style={thStyle}>Concrete</th><th style={thStyle}>Reinf</th>
          <th style={thStyle}>Formwork</th><th style={thStyle}>Blinding</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safePadFootingTypes.map((pf) => (
            <tr key={pf.id}>
              <td style={tdStyle}>{pf.name}</td>
              <td style={tdStyle}>{pf.padLength || 0}mm</td>
              <td style={tdStyle}>{pf.padWidth || 0}mm</td>
              <td style={tdStyle}>{pf.padDepth || 0}mm</td>
              <td style={tdStyle}>{pf.excavationLength || 0}mm</td>
              <td style={tdStyle}>{pf.excavationWidth || 0}mm</td>
              <td style={tdStyle}>{pf.excavationDepth || 0}mm</td>
              <td style={tdStyle}>{pf.concreteClass}</td>
              <td style={tdStyle}>{pf.reinfKg || 0}kg</td>
              <td style={tdStyle}>{pf.formworkRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{pf.blindingRequired ? "Yes" : "No"}</td>
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
        <input placeholder="Mark (e.g., PF1)" value={safeNewPadFootingMeas.mark} onChange={(e) => updatePadFootingMeas({ mark: e.target.value })} />
        <select value={safeNewPadFootingMeas.padFootingTypeId} onChange={(e) => updatePadFootingMeas({ padFootingTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safePadFootingTypes.map((pf) => <option key={pf.id} value={pf.id}>{pf.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={safeNewPadFootingMeas.quantity || ''} onChange={(e) => updatePadFootingMeas({ quantity: Number(e.target.value) || 0 })} />
        <select
          value={selectedCostPlanId}
          onChange={(e) => setSelectedCostPlanId(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="">Select Cost Plan</option>
          {costPlans.map(cp => (
            <option key={cp.id} value={cp.id}>{cp.name}</option>
          ))}
        </select>
        <button onClick={addPadFootingMeasurement}>
          {editingPadFootingMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingPadFootingMeasurementId !== null && (
          <button onClick={() => { setEditingPadFootingMeasurementId(null); resetPadFootingMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th><th style={thStyle}>Type</th><th style={thStyle}>Quantity</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safePadFootingMeasurements.map((m) => {
            const pf = safePadFootingTypes.find((p) => p.id === m.padFootingTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{pf?.name}</td>
                <td style={tdStyle}>{m.quantity}</td>
                <td style={tdStyle}>
                  <button onClick={() => editPadFootingMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deletePadFootingMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}