"use client";

import { useState } from "react";
import type { SlabType, SlabMeasurement, CostPlan } from "@/types/boq";

interface SlabModuleProps {
  slabTypes: SlabType[];
  setSlabTypes: React.Dispatch<React.SetStateAction<SlabType[]>>;
  editingSlabId: number | null;
  setEditingSlabId: React.Dispatch<React.SetStateAction<number | null>>;
  newSlab: Omit<SlabType, "id">;
  updateSlab: (partial: Partial<Omit<SlabType, "id">>) => void;
  resetSlab: () => void;
  slabMeasurements: SlabMeasurement[];
  setSlabMeasurements: React.Dispatch<React.SetStateAction<SlabMeasurement[]>>;
  newSlabMeas: Omit<SlabMeasurement, "id">;
  updateSlabMeas: (partial: Partial<Omit<SlabMeasurement, "id">>) => void;
  resetSlabMeas: () => void;
  editingSlabMeasurementId: number | null;
  setEditingSlabMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
  costPlans: CostPlan[]; // NEW
}

export default function SlabModule({
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
  styles,
  costPlans,
}: SlabModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string>("");

  // SAFEGUARD: Safe versions of all props
  const safeNewSlab = {
    name: newSlab?.name || "",
    thickness: newSlab?.thickness || 0,
    concreteClass: newSlab?.concreteClass || "30MPa/19mm",
    reinfType: newSlab?.reinfType || "Rebar",
    reinfKgPerM3: newSlab?.reinfKgPerM3 || 0,
    meshType: newSlab?.meshType || "A193",
    formworkToEdges: newSlab?.formworkToEdges ?? true,
    screedRequired: newSlab?.screedRequired ?? false,
    screedThickness: newSlab?.screedThickness || 0,
    floorFinishPcSum: newSlab?.floorFinishPcSum || 0,
    floorFinishDescription: newSlab?.floorFinishDescription || "Tiles",
  };

  const safeNewSlabMeas = {
    mark: newSlabMeas?.mark || "",
    slabTypeId: newSlabMeas?.slabTypeId || 0,
    length: newSlabMeas?.length || 0,
    width: newSlabMeas?.width || 0,
    quantity: newSlabMeas?.quantity || 0,
    area: newSlabMeas?.area || 0,
  };

  const safeSlabTypes = slabTypes || [];
  const safeSlabMeasurements = slabMeasurements || [];

  const saveSlabType = () => {
    if (!safeNewSlab.name.trim()) return;
    if (editingSlabId !== null) {
      setSlabTypes((prev) => prev.map((s) => (s.id === editingSlabId ? { ...s, ...safeNewSlab } : s)));
      setEditingSlabId(null);
    } else {
      setSlabTypes((prev) => [...prev, { id: Date.now(), ...safeNewSlab }]);
    }
    resetSlab();
  };

  const editSlabType = (id: number) => {
    const slab = safeSlabTypes.find((s) => s.id === id);
    if (slab) {
      updateSlab(slab);
      setEditingSlabId(id);
    }
  };

  const deleteSlabType = (id: number) => {
    setSlabTypes((prev) => prev.filter((s) => s.id !== id));
    setSlabMeasurements((prev) => prev.filter((m) => m.slabTypeId !== id));
  };

  const addSlabMeasurement = () => {
    if (!selectedCostPlanId) {
      alert("Please select a Cost Plan first.");
      return;
    }
    if (!safeNewSlabMeas.mark.trim() || safeNewSlabMeas.slabTypeId === 0 ||
        !safeNewSlabMeas.length || safeNewSlabMeas.length <= 0 ||
        !safeNewSlabMeas.width || safeNewSlabMeas.width <= 0 ||
        !safeNewSlabMeas.quantity || safeNewSlabMeas.quantity <= 0) {
      return;
    }

    const area = safeNewSlabMeas.length * safeNewSlabMeas.width * safeNewSlabMeas.quantity;
    const measurement = {
      id: Date.now(),
      ...safeNewSlabMeas,
      area,
      elementalSectionId: "structural-frame",
      elementalElementId: "slabs",
      costPlanId: selectedCostPlanId,
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
  };

  const editSlabMeasurement = (id: number) => {
    const measurement = safeSlabMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateSlabMeas(measurement);
      setEditingSlabMeasurementId(id);
    }
  };

  const deleteSlabMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setSlabMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingSlabMeasurementId === id) {
        setEditingSlabMeasurementId(null);
        resetSlabMeas();
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Slab Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewSlab.name} onChange={(e) => updateSlab({ name: e.target.value })} />
        <input type="number" placeholder="Thickness (mm) e.g., 175" value={safeNewSlab.thickness || ''} onChange={(e) => updateSlab({ thickness: Number(e.target.value) || 0 })} />
        <select value={safeNewSlab.concreteClass} onChange={(e) => updateSlab({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
          <option>40MPa/19mm</option>
        </select>
        <select value={safeNewSlab.reinfType} onChange={(e) => updateSlab({ reinfType: e.target.value as "Mesh" | "Rebar" })}>
          <option value="Rebar">Rebar</option>
          <option value="Mesh">Mesh</option>
        </select>
        {safeNewSlab.reinfType === "Rebar" && (
          <input type="number" placeholder="Reinforcement (kg/m³) e.g., 100" value={safeNewSlab.reinfKgPerM3 || ''} onChange={(e) => updateSlab({ reinfKgPerM3: Number(e.target.value) || 0 })} />
        )}
        {safeNewSlab.reinfType === "Mesh" && (
          <select value={safeNewSlab.meshType} onChange={(e) => updateSlab({ meshType: e.target.value })}>
            <option>A193</option><option>B193</option><option>C193</option>
          </select>
        )}
        <label><input type="checkbox" checked={safeNewSlab.formworkToEdges} onChange={(e) => updateSlab({ formworkToEdges: e.target.checked })} /> Formwork to edges</label>
        <label><input type="checkbox" checked={safeNewSlab.screedRequired} onChange={(e) => updateSlab({ screedRequired: e.target.checked })} /> Screed required</label>
        {safeNewSlab.screedRequired && (
          <input type="number" placeholder="Screed thickness (mm)" value={safeNewSlab.screedThickness || ''} onChange={(e) => updateSlab({ screedThickness: Number(e.target.value) || 0 })} />
        )}
        <input type="number" placeholder="Floor finish PC sum (R/m²)" value={safeNewSlab.floorFinishPcSum || ''} onChange={(e) => updateSlab({ floorFinishPcSum: Number(e.target.value) || 0 })} />
        <input placeholder="Floor finish description" value={safeNewSlab.floorFinishDescription} onChange={(e) => updateSlab({ floorFinishDescription: e.target.value })} />
        <button onClick={saveSlabType}>{editingSlabId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Thickness</th>
          <th style={thStyle}>Concrete</th>
          <th style={thStyle}>Reinf Type</th>
          <th style={thStyle}>Reinf</th>
          <th style={thStyle}>Formwork</th>
          <th style={thStyle}>Screed</th>
          <th style={thStyle}>Finish PC</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeSlabTypes.map((slab) => (
            <tr key={slab.id}>
              <td style={tdStyle}>{slab.name}</td>
              <td style={tdStyle}>{slab.thickness}mm</td>
              <td style={tdStyle}>{slab.concreteClass}</td>
              <td style={tdStyle}>{slab.reinfType}</td>
              <td style={tdStyle}>{slab.reinfType === "Rebar" ? `${slab.reinfKgPerM3}kg` : slab.meshType}</td>
              <td style={tdStyle}>{slab.formworkToEdges ? "Yes" : "No"}</td>
              <td style={tdStyle}>{slab.screedRequired ? `${slab.screedThickness}mm` : "No"}</td>
              <td style={tdStyle}>{slab.floorFinishPcSum > 0 ? `R${slab.floorFinishPcSum}` : "-"}</td>
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
        <input placeholder="Mark (e.g., S1)" value={safeNewSlabMeas.mark} onChange={(e) => updateSlabMeas({ mark: e.target.value })} />
        <select value={safeNewSlabMeas.slabTypeId} onChange={(e) => updateSlabMeas({ slabTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeSlabTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={safeNewSlabMeas.length || ''} onChange={(e) => updateSlabMeas({ length: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Width (m)" value={safeNewSlabMeas.width || ''} onChange={(e) => updateSlabMeas({ width: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Quantity" value={safeNewSlabMeas.quantity || ''} onChange={(e) => updateSlabMeas({ quantity: Number(e.target.value) || 0 })} />
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
        <button onClick={addSlabMeasurement}>
          {editingSlabMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingSlabMeasurementId !== null && (
          <button onClick={() => { setEditingSlabMeasurementId(null); resetSlabMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Length</th>
          <th style={thStyle}>Width</th>
          <th style={thStyle}>Qty</th>
          <th style={thStyle}>Area (m²)</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeSlabMeasurements.map((m) => {
            const slab = safeSlabTypes.find((s) => s.id === m.slabTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{slab?.name}</td>
                <td style={tdStyle}>{m.length}</td>
                <td style={tdStyle}>{m.width}</td>
                <td style={tdStyle}>{m.quantity}</td>
                <td style={tdStyle}>{m.area}</td>
                <td style={tdStyle}>
                  <button onClick={() => editSlabMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteSlabMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}