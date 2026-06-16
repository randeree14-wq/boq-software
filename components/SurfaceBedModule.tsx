"use client";

import type { SurfaceBedType, SurfaceBedMeasurement } from "@/types/boq";

interface SurfaceBedModuleProps {
  surfaceBedTypes: SurfaceBedType[];
  setSurfaceBedTypes: React.Dispatch<React.SetStateAction<SurfaceBedType[]>>;
  editingSurfaceBedId: number | null;
  setEditingSurfaceBedId: React.Dispatch<React.SetStateAction<number | null>>;
  newSurfaceBed: Omit<SurfaceBedType, "id">;
  updateSurfaceBed: (partial: Partial<Omit<SurfaceBedType, "id">>) => void;
  resetSurfaceBed: () => void;
  surfaceBedMeasurements: SurfaceBedMeasurement[];
  setSurfaceBedMeasurements: React.Dispatch<React.SetStateAction<SurfaceBedMeasurement[]>>;
  newSurfaceBedMeas: Omit<SurfaceBedMeasurement, "id">;
  updateSurfaceBedMeas: (partial: Partial<Omit<SurfaceBedMeasurement, "id">>) => void;
  resetSurfaceBedMeas: () => void;
  styles: any;
}

const SurfaceBedModule = ({
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
  styles,
}: SurfaceBedModuleProps) => {
  const saveSurfaceBedType = () => {
    if (!newSurfaceBed.name.trim()) return;
    if (editingSurfaceBedId !== null) {
      setSurfaceBedTypes((prev) => prev.map((sb) => (sb.id === editingSurfaceBedId ? { ...sb, ...newSurfaceBed } : sb)));
      setEditingSurfaceBedId(null);
    } else {
      setSurfaceBedTypes((prev) => [...prev, { id: Date.now(), ...newSurfaceBed }]);
    }
    resetSurfaceBed();
  };

  const editSurfaceBedType = (id: number) => {
    const sb = surfaceBedTypes.find((s) => s.id === id);
    if (sb) {
      updateSurfaceBed(sb);
      setEditingSurfaceBedId(id);
    }
  };

  const deleteSurfaceBedType = (id: number) => {
    setSurfaceBedTypes((prev) => prev.filter((sb) => sb.id !== id));
    setSurfaceBedMeasurements((prev) => prev.filter((m) => m.surfaceBedTypeId !== id));
  };

  const addSurfaceBedMeasurement = () => {
    if (!newSurfaceBedMeas.mark.trim() || newSurfaceBedMeas.surfaceBedTypeId === 0 || newSurfaceBedMeas.area <= 0) return;
    setSurfaceBedMeasurements((prev) => [...prev, { id: Date.now(), ...newSurfaceBedMeas }]);
    resetSurfaceBedMeas();
  };

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  return (
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
        <h3 style={{ gridColumn: "1 / -1" }}>Layerworks</h3>
        <select value={newSurfaceBed.layer1Material} onChange={(e) => updateSurfaceBed({ layer1Material: e.target.value })}>
          <option value="">No Layer 1</option><option>G5</option><option>G6</option><option>G7</option><option>Selected Fill</option><option>Imported Fill</option>
        </select>
        <input type="number" placeholder="Layer1 thickness" value={newSurfaceBed.layer1Thickness} onChange={(e) => updateSurfaceBed({ layer1Thickness: Number(e.target.value) })} />
        <select value={newSurfaceBed.layer2Material} onChange={(e) => updateSurfaceBed({ layer2Material: e.target.value })}>
          <option value="">No Layer 2</option><option>G5</option><option>G6</option><option>G7</option><option>Selected Fill</option><option>Imported Fill</option>
        </select>
        <input type="number" placeholder="Layer2 thickness" value={newSurfaceBed.layer2Thickness} onChange={(e) => updateSurfaceBed({ layer2Thickness: Number(e.target.value) })} />
        <select value={newSurfaceBed.layer3Material} onChange={(e) => updateSurfaceBed({ layer3Material: e.target.value })}>
          <option value="">No Layer 3</option><option>G5</option><option>G6</option><option>G7</option><option>Selected Fill</option><option>Imported Fill</option>
        </select>
        <input type="number" placeholder="Layer3 thickness" value={newSurfaceBed.layer3Thickness} onChange={(e) => updateSurfaceBed({ layer3Thickness: Number(e.target.value) })} />
        <h3 style={{ gridColumn: "1 / -1" }}>Finishes</h3>
        <label><input type="checkbox" checked={newSurfaceBed.powerfloat} onChange={(e) => updateSurfaceBed({ powerfloat: e.target.checked })} /> Powerfloat</label>
        <label><input type="checkbox" checked={newSurfaceBed.screedRequired} onChange={(e) => updateSurfaceBed({ screedRequired: e.target.checked })} /> Screed</label>
        <input type="number" placeholder="Screed thickness" value={newSurfaceBed.screedThickness} onChange={(e) => updateSurfaceBed({ screedThickness: Number(e.target.value) })} />
        <select value={newSurfaceBed.screedType} onChange={(e) => updateSurfaceBed({ screedType: e.target.value })}>
          <option>Normal</option><option>To Falls</option>
        </select>
        <label><input type="checkbox" checked={newSurfaceBed.tileRequired} onChange={(e) => updateSurfaceBed({ tileRequired: e.target.checked })} /> Tiles</label>
        <input type="number" placeholder="Tile PC Sum R/m²" value={newSurfaceBed.tilePcSum} onChange={(e) => updateSurfaceBed({ tilePcSum: Number(e.target.value) })} />
        <button onClick={saveSurfaceBedType}>{editingSurfaceBedId !== null ? "Update" : "Save"}</button>
      </div>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr><th>Name</th><th>Category</th><th>Thick</th><th>Concrete</th><th>Mesh</th><th>DPM</th><th>Soil</th><th>Layer1</th><th>Layer2</th><th>Layer3</th><th>Powerfloat</th><th>Screed</th><th>Tiles</th><th>Actions</th></tr></thead>
        <tbody>
          {surfaceBedTypes.map((sb) => (
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
              <td style={tdStyle}>{sb.tileRequired ? `PC R${sb.tilePcSum}/m²` : "No"}</td>
              <td style={tdStyle}>
                <button onClick={() => editSurfaceBedType(sb.id)}>Edit</button>
                <button onClick={() => deleteSurfaceBedType(sb.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <h2>Surface Bed Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark" value={newSurfaceBedMeas.mark} onChange={(e) => updateSurfaceBedMeas({ mark: e.target.value })} />
        <select value={newSurfaceBedMeas.surfaceBedTypeId} onChange={(e) => updateSurfaceBedMeas({ surfaceBedTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {surfaceBedTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="number" placeholder="Area (m²)" value={newSurfaceBedMeas.area} onChange={(e) => updateSurfaceBedMeas({ area: Number(e.target.value) })} />
        <button onClick={addSurfaceBedMeasurement}>Add</button>
      </div>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr><th>Mark</th><th>Surface Bed Type</th><th>Area</th></tr></thead>
        <tbody>
          {surfaceBedMeasurements.map((m) => {
            const sb = surfaceBedTypes.find((s) => s.id === m.surfaceBedTypeId);
            return <tr key={m.id}><td style={tdStyle}>{m.mark}</td><td style={tdStyle}>{sb?.name}</td><td style={tdStyle}>{m.area}</td></tr>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SurfaceBedModule;