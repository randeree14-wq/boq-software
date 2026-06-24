"use client";

import type { ColumnType, ColumnMeasurement } from "@/types/boq";

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
}

const ColumnModule = ({
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
}: ColumnModuleProps) => {
  const saveColumnType = () => {
    if (!newColumn.name.trim()) return;
    if (editingColumnId !== null) {
      setColumnTypes((prev) => prev.map((c) => (c.id === editingColumnId ? { ...c, ...newColumn } : c)));
      setEditingColumnId(null);
    } else {
      setColumnTypes((prev) => [...prev, { id: Date.now(), ...newColumn }]);
    }
    resetColumn();
  };

  const editColumnType = (id: number) => {
    const col = columnTypes.find((c) => c.id === id);
    if (col) {
      updateColumn(col);
      setEditingColumnId(id);
    }
  };

  const deleteColumnType = (id: number) => {
    setColumnTypes((prev) => prev.filter((c) => c.id !== id));
    setColumnMeasurements((prev) => prev.filter((m) => m.columnTypeId !== id));
  };

  const saveColumnMeasurement = () => {
    if (!newColumnMeas.mark.trim() || newColumnMeas.columnTypeId === 0 || newColumnMeas.quantity <= 0) return;
    
    if (editingColumnMeasurementId !== null) {
      setColumnMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingColumnMeasurementId ? { ...m, ...newColumnMeas } : m
        )
      );
      setEditingColumnMeasurementId(null);
    } else {
      setColumnMeasurements((prev) => [...prev, { id: Date.now(), ...newColumnMeas }]);
    }
    resetColumnMeas();
  };

  const editColumnMeasurement = (id: number) => {
    const measurement = columnMeasurements.find((m) => m.id === id);
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

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  return (
    <div style={cardStyle}>
      <h1>Column Module</h1>
      <h2>Column Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newColumn.name} onChange={(e) => updateColumn({ name: e.target.value })} />
        <input type="number" placeholder="Width (mm) e.g., 300" value={newColumn.width} onChange={(e) => updateColumn({ width: Number(e.target.value) })} />
        <input type="number" placeholder="Depth (mm) e.g., 400" value={newColumn.depth} onChange={(e) => updateColumn({ depth: Number(e.target.value) })} />
        <input type="number" placeholder="Height (mm) e.g., 3000" value={newColumn.height} onChange={(e) => updateColumn({ height: Number(e.target.value) })} />
        <select value={newColumn.concreteClass} onChange={(e) => updateColumn({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinforcement (kg/m³) e.g., 200" value={newColumn.reinfKgPerM3} onChange={(e) => updateColumn({ reinfKgPerM3: Number(e.target.value) })} />
        <label><input type="checkbox" checked={newColumn.formworkRequired} onChange={(e) => updateColumn({ formworkRequired: e.target.checked })} /> Formwork</label>
        <select value={newColumn.formworkFinish} onChange={(e) => updateColumn({ formworkFinish: e.target.value })}>
          <option>Smooth</option><option>Rough</option><option>Special</option>
        </select>
        <button onClick={saveColumnType}>{editingColumnId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th><th style={thStyle}>Width</th><th style={thStyle}>Depth</th>
            <th style={thStyle}>Height</th><th style={thStyle}>Concrete</th><th style={thStyle}>Reinf</th>
            <th style={thStyle}>Formwork</th><th style={thStyle}>Finish</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {columnTypes.map((col) => (
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
          ))}
        </tbody>
      </table>

      <hr />
      <h2>Column Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark" value={newColumnMeas.mark} onChange={(e) => updateColumnMeas({ mark: e.target.value })} />
        <select value={newColumnMeas.columnTypeId} onChange={(e) => updateColumnMeas({ columnTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {columnTypes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={newColumnMeas.quantity} onChange={(e) => updateColumnMeas({ quantity: Number(e.target.value) })} />
        <button onClick={saveColumnMeasurement}>
          {editingColumnMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingColumnMeasurementId !== null && (
          <button onClick={() => { setEditingColumnMeasurementId(null); resetColumnMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Column Type</th><th style={thStyle}>Quantity</th><th style={thStyle}>Actions</th></tr>
        </thead>
        <tbody>
          {columnMeasurements.map((m) => {
            const col = columnTypes.find((c) => c.id === m.columnTypeId);
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
};

export default ColumnModule;