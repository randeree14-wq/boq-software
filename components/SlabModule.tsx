"use client";

import type { SlabType, SlabMeasurement } from "@/types/boq";

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
}

const SlabModule = ({
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
}: SlabModuleProps) => {
  const saveSlabType = () => {
    if (!newSlab.name.trim()) return;
    if (editingSlabId !== null) {
      setSlabTypes((prev) => prev.map((s) => (s.id === editingSlabId ? { ...s, ...newSlab } : s)));
      setEditingSlabId(null);
    } else {
      setSlabTypes((prev) => [...prev, { id: Date.now(), ...newSlab }]);
    }
    resetSlab();
  };

  const editSlabType = (id: number) => {
    const slab = slabTypes.find((s) => s.id === id);
    if (slab) {
      updateSlab(slab);
      setEditingSlabId(id);
    }
  };

  const deleteSlabType = (id: number) => {
    setSlabTypes((prev) => prev.filter((s) => s.id !== id));
    setSlabMeasurements((prev) => prev.filter((m) => m.slabTypeId !== id));
  };

  const saveSlabMeasurement = () => {
    if (!newSlabMeas.mark.trim() || newSlabMeas.slabTypeId === 0 || newSlabMeas.length <= 0 || newSlabMeas.width <= 0 || newSlabMeas.quantity <= 0) return;
    
    const area = newSlabMeas.length * newSlabMeas.width * newSlabMeas.quantity;
    const measurementData = { ...newSlabMeas, area };
    
    if (editingSlabMeasurementId !== null) {
      setSlabMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingSlabMeasurementId ? { ...m, ...measurementData } : m
        )
      );
      setEditingSlabMeasurementId(null);
    } else {
      setSlabMeasurements((prev) => [...prev, { id: Date.now(), ...measurementData }]);
    }
    resetSlabMeas();
  };

  const editSlabMeasurement = (id: number) => {
    const measurement = slabMeasurements.find((m) => m.id === id);
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

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  return (
    <div style={cardStyle}>
      <h1>Suspended Slab Module</h1>
      <h2>Slab Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newSlab.name} onChange={(e) => updateSlab({ name: e.target.value })} />
        <input type="number" placeholder="Thickness mm" value={newSlab.thickness} onChange={(e) => updateSlab({ thickness: Number(e.target.value) })} />
        <select value={newSlab.concreteClass} onChange={(e) => updateSlab({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
        </select>
        <select value={newSlab.reinfType} onChange={(e) => updateSlab({ reinfType: e.target.value as "Mesh" | "Rebar" })}>
          <option>Rebar</option><option>Mesh</option>
        </select>
        {newSlab.reinfType === "Rebar" && (
          <input type="number" placeholder="Reinf kg/m³" value={newSlab.reinfKgPerM3} onChange={(e) => updateSlab({ reinfKgPerM3: Number(e.target.value) })} />
        )}
        {newSlab.reinfType === "Mesh" && (
          <select value={newSlab.meshType} onChange={(e) => updateSlab({ meshType: e.target.value })}>
            <option>A193</option><option>A252</option><option>B196</option><option>B283</option><option>None</option>
          </select>
        )}
        <label><input type="checkbox" checked={newSlab.formworkToEdges} onChange={(e) => updateSlab({ formworkToEdges: e.target.checked })} /> Formwork to edges</label>
        <label><input type="checkbox" checked={newSlab.screedRequired} onChange={(e) => updateSlab({ screedRequired: e.target.checked })} /> Screed</label>
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
            <th style={thStyle}>Name</th><th style={thStyle}>Thick</th><th style={thStyle}>Concrete</th>
            <th style={thStyle}>Reinf</th><th style={thStyle}>Edges</th><th style={thStyle}>Screed</th>
            <th style={thStyle}>Floor Finish</th><th style={thStyle}>Actions</th>
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
          {slabTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={newSlabMeas.length} onChange={(e) => updateSlabMeas({ length: Number(e.target.value) })} />
        <input type="number" placeholder="Width (m)" value={newSlabMeas.width} onChange={(e) => updateSlabMeas({ width: Number(e.target.value) })} />
        <input type="number" placeholder="Quantity" value={newSlabMeas.quantity} onChange={(e) => updateSlabMeas({ quantity: Number(e.target.value) })} />
        <button onClick={saveSlabMeasurement}>
          {editingSlabMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingSlabMeasurementId !== null && (
          <button onClick={() => { setEditingSlabMeasurementId(null); resetSlabMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Slab Type</th><th style={thStyle}>Length</th><th style={thStyle}>Width</th><th style={thStyle}>Qty</th><th style={thStyle}>Area</th><th style={thStyle}>Actions</th></tr>
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
};

export default SlabModule;