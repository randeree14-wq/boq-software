"use client";

import { useState } from "react";
import type { GroundBeamType, GroundBeamMeasurement, CostPlan } from "@/types/boq";

interface GroundBeamModuleProps {
  groundBeamTypes: GroundBeamType[];
  setGroundBeamTypes: React.Dispatch<React.SetStateAction<GroundBeamType[]>>;
  editingGroundBeamId: number | null;
  setEditingGroundBeamId: React.Dispatch<React.SetStateAction<number | null>>;
  newGroundBeam: Omit<GroundBeamType, "id">;
  updateGroundBeam: (partial: Partial<Omit<GroundBeamType, "id">>) => void;
  resetGroundBeam: () => void;
  groundBeamMeasurements: GroundBeamMeasurement[];
  setGroundBeamMeasurements: React.Dispatch<React.SetStateAction<GroundBeamMeasurement[]>>;
  newGroundBeamMeas: Omit<GroundBeamMeasurement, "id">;
  updateGroundBeamMeas: (partial: Partial<Omit<GroundBeamMeasurement, "id">>) => void;
  resetGroundBeamMeas: () => void;
  editingGroundBeamMeasurementId: number | null;
  setEditingGroundBeamMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
  costPlans: CostPlan[]; // NEW
}

export default function GroundBeamModule({
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
  styles,
  costPlans,
}: GroundBeamModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string>("");

  // SAFEGUARD: Safe versions of all props
  const safeNewGroundBeam = {
    name: newGroundBeam?.name || "",
    trenchWidth: newGroundBeam?.trenchWidth || 0,
    trenchDepth: newGroundBeam?.trenchDepth || 0,
    beamWidth: newGroundBeam?.beamWidth || 0,
    beamDepth: newGroundBeam?.beamDepth || 0,
    concreteClass: newGroundBeam?.concreteClass || "30MPa/19mm",
    reinfKgPerM3: newGroundBeam?.reinfKgPerM3 || 0,
    formworkRequired: newGroundBeam?.formworkRequired ?? true,
    blindingRequired: newGroundBeam?.blindingRequired ?? true,
    blindingThickness: newGroundBeam?.blindingThickness || 0,
    backfillRequired: newGroundBeam?.backfillRequired ?? true,
    dpcRequired: newGroundBeam?.dpcRequired ?? false,
    soilPoisonRequired: newGroundBeam?.soilPoisonRequired ?? false,
    workingSpaceRequired: newGroundBeam?.workingSpaceRequired ?? false,
    riskOfCollapseRequired: newGroundBeam?.riskOfCollapseRequired ?? false,
  };

  const safeNewGroundBeamMeas = {
    mark: newGroundBeamMeas?.mark || "",
    groundBeamTypeId: newGroundBeamMeas?.groundBeamTypeId || 0,
    length: newGroundBeamMeas?.length || 0,
  };

  const safeGroundBeamTypes = groundBeamTypes || [];
  const safeGroundBeamMeasurements = groundBeamMeasurements || [];

  const saveGroundBeamType = () => {
    if (!safeNewGroundBeam.name.trim()) return;
    if (editingGroundBeamId !== null) {
      setGroundBeamTypes((prev) => prev.map((gb) => (gb.id === editingGroundBeamId ? { ...gb, ...safeNewGroundBeam } : gb)));
      setEditingGroundBeamId(null);
    } else {
      setGroundBeamTypes((prev) => [...prev, { id: Date.now(), ...safeNewGroundBeam }]);
    }
    resetGroundBeam();
  };

  const editGroundBeamType = (id: number) => {
    const gb = safeGroundBeamTypes.find((g) => g.id === id);
    if (gb) {
      updateGroundBeam(gb);
      setEditingGroundBeamId(id);
    }
  };

  const deleteGroundBeamType = (id: number) => {
    setGroundBeamTypes((prev) => prev.filter((gb) => gb.id !== id));
    setGroundBeamMeasurements((prev) => prev.filter((m) => m.groundBeamTypeId !== id));
  };

  const addGroundBeamMeasurement = () => {
    if (!selectedCostPlanId) {
      alert("Please select a Cost Plan first.");
      return;
    }
    if (!safeNewGroundBeamMeas.mark.trim() || safeNewGroundBeamMeas.groundBeamTypeId === 0 || !safeNewGroundBeamMeas.length || safeNewGroundBeamMeas.length <= 0) return;
    const measurement = {
      id: Date.now(),
      ...safeNewGroundBeamMeas,
      elementalSectionId: "substructure",
      elementalElementId: "ground-beams",
      costPlanId: selectedCostPlanId,
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
  };

  const editGroundBeamMeasurement = (id: number) => {
    const measurement = safeGroundBeamMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateGroundBeamMeas(measurement);
      setEditingGroundBeamMeasurementId(id);
    }
  };

  const deleteGroundBeamMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setGroundBeamMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingGroundBeamMeasurementId === id) {
        setEditingGroundBeamMeasurementId(null);
        resetGroundBeamMeas();
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Ground Beam Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewGroundBeam.name} onChange={(e) => updateGroundBeam({ name: e.target.value })} />
        <input type="number" placeholder="Trench width (mm) e.g., 600" value={safeNewGroundBeam.trenchWidth || ''} onChange={(e) => updateGroundBeam({ trenchWidth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Trench depth (mm) e.g., 1000" value={safeNewGroundBeam.trenchDepth || ''} onChange={(e) => updateGroundBeam({ trenchDepth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Beam width (mm) e.g., 350" value={safeNewGroundBeam.beamWidth || ''} onChange={(e) => updateGroundBeam({ beamWidth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Beam depth (mm) e.g., 450" value={safeNewGroundBeam.beamDepth || ''} onChange={(e) => updateGroundBeam({ beamDepth: Number(e.target.value) || 0 })} />
        <select value={safeNewGroundBeam.concreteClass} onChange={(e) => updateGroundBeam({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option><option>40MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinforcement (kg/m³) e.g., 150" value={safeNewGroundBeam.reinfKgPerM3 || ''} onChange={(e) => updateGroundBeam({ reinfKgPerM3: Number(e.target.value) || 0 })} />
        <label><input type="checkbox" checked={safeNewGroundBeam.formworkRequired} onChange={(e) => updateGroundBeam({ formworkRequired: e.target.checked })} /> Formwork required</label>
        <label><input type="checkbox" checked={safeNewGroundBeam.blindingRequired} onChange={(e) => updateGroundBeam({ blindingRequired: e.target.checked })} /> Blinding required</label>
        {safeNewGroundBeam.blindingRequired && (
          <input type="number" placeholder="Blinding thickness (mm) e.g., 50" value={safeNewGroundBeam.blindingThickness || ''} onChange={(e) => updateGroundBeam({ blindingThickness: Number(e.target.value) || 0 })} />
        )}
        <label><input type="checkbox" checked={safeNewGroundBeam.backfillRequired} onChange={(e) => updateGroundBeam({ backfillRequired: e.target.checked })} /> Backfill required</label>
        <label><input type="checkbox" checked={safeNewGroundBeam.dpcRequired} onChange={(e) => updateGroundBeam({ dpcRequired: e.target.checked })} /> DPC required</label>
        <label><input type="checkbox" checked={safeNewGroundBeam.soilPoisonRequired} onChange={(e) => updateGroundBeam({ soilPoisonRequired: e.target.checked })} /> Soil poison</label>
        <label><input type="checkbox" checked={safeNewGroundBeam.workingSpaceRequired} onChange={(e) => updateGroundBeam({ workingSpaceRequired: e.target.checked })} /> Working space</label>
        <label><input type="checkbox" checked={safeNewGroundBeam.riskOfCollapseRequired} onChange={(e) => updateGroundBeam({ riskOfCollapseRequired: e.target.checked })} /> Risk of collapse</label>
        <button onClick={saveGroundBeamType}>{editingGroundBeamId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th><th style={thStyle}>Trench W</th><th style={thStyle}>Trench D</th>
          <th style={thStyle}>Beam W</th><th style={thStyle}>Beam D</th>
          <th style={thStyle}>Concrete</th><th style={thStyle}>Reinf</th>
          <th style={thStyle}>Formwork</th><th style={thStyle}>Blinding</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeGroundBeamTypes.map((gb) => (
            <tr key={gb.id}>
              <td style={tdStyle}>{gb.name}</td>
              <td style={tdStyle}>{gb.trenchWidth || 0}mm</td>
              <td style={tdStyle}>{gb.trenchDepth || 0}mm</td>
              <td style={tdStyle}>{gb.beamWidth || 0}mm</td>
              <td style={tdStyle}>{gb.beamDepth || 0}mm</td>
              <td style={tdStyle}>{gb.concreteClass}</td>
              <td style={tdStyle}>{gb.reinfKgPerM3 || 0}kg</td>
              <td style={tdStyle}>{gb.formworkRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{gb.blindingRequired ? "Yes" : "No"}</td>
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
        <input placeholder="Mark (e.g., GB1)" value={safeNewGroundBeamMeas.mark} onChange={(e) => updateGroundBeamMeas({ mark: e.target.value })} />
        <select value={safeNewGroundBeamMeas.groundBeamTypeId} onChange={(e) => updateGroundBeamMeas({ groundBeamTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeGroundBeamTypes.map((gb) => <option key={gb.id} value={gb.id}>{gb.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={safeNewGroundBeamMeas.length || ''} onChange={(e) => updateGroundBeamMeas({ length: Number(e.target.value) || 0 })} />
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
        <button onClick={addGroundBeamMeasurement}>
          {editingGroundBeamMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingGroundBeamMeasurementId !== null && (
          <button onClick={() => { setEditingGroundBeamMeasurementId(null); resetGroundBeamMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th><th style={thStyle}>Type</th><th style={thStyle}>Length (m)</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeGroundBeamMeasurements.map((m) => {
            const gb = safeGroundBeamTypes.find((g) => g.id === m.groundBeamTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{gb?.name}</td>
                <td style={tdStyle}>{m.length}</td>
                <td style={tdStyle}>
                  <button onClick={() => editGroundBeamMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteGroundBeamMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}