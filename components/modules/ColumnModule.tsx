"use client";

import { useState } from "react";
import type { ColumnType, ColumnMeasurement, CostPlan } from "@/types/boq";

interface ColumnModuleProps {
  columnTypes: ColumnType[];
  setColumnTypes: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  editingColumnId: number | null;
  setEditingColumnId: React.Dispatch<React.SetStateAction<number | null>>;
  newColumn: Omit<ColumnType, "id">;
  updateColumn: (partial: Partial<Omit<ColumnType, "id">>) => void;
  resetColumn: () => void;
  columnMeasurements: ColumnMeasurement[];
  setColumnMeasurements: React.Dispatch<React.SetStateAction<ColumnMeasurement[]>>;
  newColumnMeas: Omit<ColumnMeasurement, "id">;
  updateColumnMeas: (partial: Partial<Omit<ColumnMeasurement, "id">>) => void;
  resetColumnMeas: () => void;
  editingColumnMeasurementId: number | null;
  setEditingColumnMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
  costPlans: CostPlan[]; // NEW
}

export default function ColumnModule({
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
  styles,
  costPlans,
}: ColumnModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string>("");

  // SAFEGUARD: Safe versions of all props
  const safeNewColumn = {
    name: newColumn?.name || "",
    width: newColumn?.width || 0,
    depth: newColumn?.depth || 0,
    height: newColumn?.height || 0,
    concreteClass: newColumn?.concreteClass || "35MPa/19mm",
    reinfKgPerM3: newColumn?.reinfKgPerM3 || 0,
    formworkRequired: newColumn?.formworkRequired ?? true,
    formworkFinish: newColumn?.formworkFinish || "Smooth",
  };

  const safeNewColumnMeas = {
    mark: newColumnMeas?.mark || "",
    columnTypeId: newColumnMeas?.columnTypeId || 0,
    quantity: newColumnMeas?.quantity || 0,
  };

  const safeColumnTypes = columnTypes || [];
  const safeColumnMeasurements = columnMeasurements || [];

  const saveColumnType = () => {
    if (!safeNewColumn.name.trim()) return;
    if (editingColumnId !== null) {
      setColumnTypes((prev) => prev.map((c) => (c.id === editingColumnId ? { ...c, ...safeNewColumn } : c)));
      setEditingColumnId(null);
    } else {
      setColumnTypes((prev) => [...prev, { id: Date.now(), ...safeNewColumn }]);
    }
    resetColumn();
  };

  const editColumnType = (id: number) => {
    const col = safeColumnTypes.find((c) => c.id === id);
    if (col) {
      updateColumn(col);
      setEditingColumnId(id);
    }
  };

  const deleteColumnType = (id: number) => {
    setColumnTypes((prev) => prev.filter((c) => c.id !== id));
    setColumnMeasurements((prev) => prev.filter((m) => m.columnTypeId !== id));
  };

  const addColumnMeasurement = () => {
    if (!selectedCostPlanId) {
      alert("Please select a Cost Plan first.");
      return;
    }
    if (!safeNewColumnMeas.mark.trim() || safeNewColumnMeas.columnTypeId === 0 || !safeNewColumnMeas.quantity || safeNewColumnMeas.quantity <= 0) return;
    const measurement = {
      id: Date.now(),
      ...safeNewColumnMeas,
      elementalSectionId: "Structural Frame",
      elementalElementId: "columns",
      costPlanId: selectedCostPlanId,
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
  };

  const editColumnMeasurement = (id: number) => {
    const measurement = safeColumnMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateColumnMeas(measurement);
      setEditingColumnMeasurementId(id);
    }
  };

  const deleteColumnMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setColumnMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingColumnMeasurementId === id) {
        setEditingColumnMeasurementId(null);
        resetColumnMeas();
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Column Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewColumn.name} onChange={(e) => updateColumn({ name: e.target.value })} />
        <input type="number" placeholder="Width (mm) e.g., 300" value={safeNewColumn.width || ''} onChange={(e) => updateColumn({ width: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Depth (mm) e.g., 300" value={safeNewColumn.depth || ''} onChange={(e) => updateColumn({ depth: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Height (mm) e.g., 3000" value={safeNewColumn.height || ''} onChange={(e) => updateColumn({ height: Number(e.target.value) || 0 })} />
        <select value={safeNewColumn.concreteClass} onChange={(e) => updateColumn({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option><option>40MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinforcement (kg/m³) e.g., 150" value={safeNewColumn.reinfKgPerM3 || ''} onChange={(e) => updateColumn({ reinfKgPerM3: Number(e.target.value) || 0 })} />
        <label><input type="checkbox" checked={safeNewColumn.formworkRequired} onChange={(e) => updateColumn({ formworkRequired: e.target.checked })} /> Formwork required</label>
        <select value={safeNewColumn.formworkFinish} onChange={(e) => updateColumn({ formworkFinish: e.target.value })}>
          <option>Smooth</option><option>Rough</option><option>Fair Faced</option>
        </select>
        <button onClick={saveColumnType}>{editingColumnId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th><th style={thStyle}>Width</th><th style={thStyle}>Depth</th>
          <th style={thStyle}>Height</th><th style={thStyle}>Concrete</th>
          <th style={thStyle}>Reinf</th><th style={thStyle}>Formwork</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeColumnTypes.map((col) => (
            <tr key={col.id}>
              <td style={tdStyle}>{col.name}</td>
              <td style={tdStyle}>{col.width}mm</td>
              <td style={tdStyle}>{col.depth}mm</td>
              <td style={tdStyle}>{col.height}mm</td>
              <td style={tdStyle}>{col.concreteClass}</td>
              <td style={tdStyle}>{col.reinfKgPerM3 || 0}kg</td>
              <td style={tdStyle}>{col.formworkRequired ? `Yes (${col.formworkFinish})` : "No"}</td>
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
        <input placeholder="Mark (e.g., C1)" value={safeNewColumnMeas.mark} onChange={(e) => updateColumnMeas({ mark: e.target.value })} />
        <select value={safeNewColumnMeas.columnTypeId} onChange={(e) => updateColumnMeas({ columnTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeColumnTypes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={safeNewColumnMeas.quantity || ''} onChange={(e) => updateColumnMeas({ quantity: Number(e.target.value) || 0 })} />
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
        <button onClick={addColumnMeasurement}>
          {editingColumnMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingColumnMeasurementId !== null && (
          <button onClick={() => { setEditingColumnMeasurementId(null); resetColumnMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th><th style={thStyle}>Type</th><th style={thStyle}>Quantity</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeColumnMeasurements.map((m) => {
            const col = safeColumnTypes.find((c) => c.id === m.columnTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{col?.name}</td>
                <td style={tdStyle}>{m.quantity}</td>
                <td style={tdStyle}>
                  <button onClick={() => editColumnMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteColumnMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}