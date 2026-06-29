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
  editingSurfaceBedMeasurementId: number | null;
  setEditingSurfaceBedMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
}

export default function SurfaceBedModule({
  surfaceBedTypes,
  setSurfaceBedTypes,
  editingSurfaceBedId,
  setEditingSurfaceBedId,
  newSurfaceBed,
  updateSurfaceBed = () => {},
  resetSurfaceBed = () => {},
  surfaceBedMeasurements,
  setSurfaceBedMeasurements,
  newSurfaceBedMeas,
  updateSurfaceBedMeas = () => {},
  resetSurfaceBedMeas = () => {},
  editingSurfaceBedMeasurementId,
  setEditingSurfaceBedMeasurementId,
  styles,
}: SurfaceBedModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};

  // SAFEGUARD: Safe versions of all props
  const safeNewSurfaceBed = {
    name: newSurfaceBed?.name || "",
    category: newSurfaceBed?.category || "Internal",
    thickness: newSurfaceBed?.thickness || 0,
    concreteClass: newSurfaceBed?.concreteClass || "35MPa/19mm",
    meshType: newSurfaceBed?.meshType || "Ref193",
    dpm: newSurfaceBed?.dpm ?? true,
    soilPoison: newSurfaceBed?.soilPoison ?? true,
    layer1Material: newSurfaceBed?.layer1Material || "",
    layer1Thickness: newSurfaceBed?.layer1Thickness || 0,
    layer2Material: newSurfaceBed?.layer2Material || "",
    layer2Thickness: newSurfaceBed?.layer2Thickness || 0,
    layer3Material: newSurfaceBed?.layer3Material || "",
    layer3Thickness: newSurfaceBed?.layer3Thickness || 0,
    powerfloat: newSurfaceBed?.powerfloat ?? true,
    screedRequired: newSurfaceBed?.screedRequired ?? false,
    screedThickness: newSurfaceBed?.screedThickness || 0,
    screedType: newSurfaceBed?.screedType || "Normal",
    tileRequired: newSurfaceBed?.tileRequired ?? false,
    tilePcSum: newSurfaceBed?.tilePcSum || 0,
  };

  const safeNewSurfaceBedMeas = {
    mark: newSurfaceBedMeas?.mark || "",
    surfaceBedTypeId: newSurfaceBedMeas?.surfaceBedTypeId || 0,
    area: newSurfaceBedMeas?.area || 0,
  };

  const safeSurfaceBedTypes = surfaceBedTypes || [];
  const safeSurfaceBedMeasurements = surfaceBedMeasurements || [];

  const saveSurfaceBedType = () => {
    if (!safeNewSurfaceBed.name.trim()) return;
    if (editingSurfaceBedId !== null) {
      setSurfaceBedTypes((prev) => prev.map((sb) => (sb.id === editingSurfaceBedId ? { ...sb, ...safeNewSurfaceBed } : sb)));
      setEditingSurfaceBedId(null);
    } else {
      setSurfaceBedTypes((prev) => [...prev, { id: Date.now(), ...safeNewSurfaceBed }]);
    }
    resetSurfaceBed();
  };

  const editSurfaceBedType = (id: number) => {
    const sb = safeSurfaceBedTypes.find((s) => s.id === id);
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
    if (!safeNewSurfaceBedMeas.mark.trim() || safeNewSurfaceBedMeas.surfaceBedTypeId === 0 || !safeNewSurfaceBedMeas.area || safeNewSurfaceBedMeas.area <= 0) return;
    const measurement = {
      id: Date.now(),
      ...safeNewSurfaceBedMeas,
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
  };

  const editSurfaceBedMeasurement = (id: number) => {
    const measurement = safeSurfaceBedMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateSurfaceBedMeas(measurement);
      setEditingSurfaceBedMeasurementId(id);
    }
  };

  const deleteSurfaceBedMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setSurfaceBedMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingSurfaceBedMeasurementId === id) {
        setEditingSurfaceBedMeasurementId(null);
        resetSurfaceBedMeas();
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Surface Bed Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewSurfaceBed.name} onChange={(e) => updateSurfaceBed({ name: e.target.value })} />
        <select value={safeNewSurfaceBed.category} onChange={(e) => updateSurfaceBed({ category: e.target.value })}>
          <option>Internal</option><option>External</option>
        </select>
        <input type="number" placeholder="Thickness (mm) e.g., 150" value={safeNewSurfaceBed.thickness || ''} onChange={(e) => updateSurfaceBed({ thickness: Number(e.target.value) || 0 })} />
        <select value={safeNewSurfaceBed.concreteClass} onChange={(e) => updateSurfaceBed({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option><option>40MPa/19mm</option>
        </select>
        <select value={safeNewSurfaceBed.meshType} onChange={(e) => updateSurfaceBed({ meshType: e.target.value })}>
          <option>None</option><option>Ref193</option><option>A193</option><option>B193</option>
        </select>
        <label><input type="checkbox" checked={safeNewSurfaceBed.dpm} onChange={(e) => updateSurfaceBed({ dpm: e.target.checked })} /> DPM required</label>
        <label><input type="checkbox" checked={safeNewSurfaceBed.soilPoison} onChange={(e) => updateSurfaceBed({ soilPoison: e.target.checked })} /> Soil poison</label>
        <input placeholder="Layer 1 Material" value={safeNewSurfaceBed.layer1Material} onChange={(e) => updateSurfaceBed({ layer1Material: e.target.value })} />
        <input type="number" placeholder="Layer 1 Thickness (mm)" value={safeNewSurfaceBed.layer1Thickness || ''} onChange={(e) => updateSurfaceBed({ layer1Thickness: Number(e.target.value) || 0 })} />
        <input placeholder="Layer 2 Material" value={safeNewSurfaceBed.layer2Material} onChange={(e) => updateSurfaceBed({ layer2Material: e.target.value })} />
        <input type="number" placeholder="Layer 2 Thickness (mm)" value={safeNewSurfaceBed.layer2Thickness || ''} onChange={(e) => updateSurfaceBed({ layer2Thickness: Number(e.target.value) || 0 })} />
        <input placeholder="Layer 3 Material" value={safeNewSurfaceBed.layer3Material} onChange={(e) => updateSurfaceBed({ layer3Material: e.target.value })} />
        <input type="number" placeholder="Layer 3 Thickness (mm)" value={safeNewSurfaceBed.layer3Thickness || ''} onChange={(e) => updateSurfaceBed({ layer3Thickness: Number(e.target.value) || 0 })} />
        <label><input type="checkbox" checked={safeNewSurfaceBed.powerfloat} onChange={(e) => updateSurfaceBed({ powerfloat: e.target.checked })} /> Powerfloat finish</label>
        <label><input type="checkbox" checked={safeNewSurfaceBed.screedRequired} onChange={(e) => updateSurfaceBed({ screedRequired: e.target.checked })} /> Screed required</label>
        {safeNewSurfaceBed.screedRequired && (
          <>
            <input type="number" placeholder="Screed thickness (mm)" value={safeNewSurfaceBed.screedThickness || ''} onChange={(e) => updateSurfaceBed({ screedThickness: Number(e.target.value) || 0 })} />
            <select value={safeNewSurfaceBed.screedType} onChange={(e) => updateSurfaceBed({ screedType: e.target.value })}>
              <option>Normal</option><option>Heavy Duty</option><option>Lightweight</option>
            </select>
          </>
        )}
        <label><input type="checkbox" checked={safeNewSurfaceBed.tileRequired} onChange={(e) => updateSurfaceBed({ tileRequired: e.target.checked })} /> Tiles required</label>
        {safeNewSurfaceBed.tileRequired && (
          <input type="number" placeholder="Tile PC sum (R/m²)" value={safeNewSurfaceBed.tilePcSum || ''} onChange={(e) => updateSurfaceBed({ tilePcSum: Number(e.target.value) || 0 })} />
        )}
        <button onClick={saveSurfaceBedType}>{editingSurfaceBedId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th><th style={thStyle}>Category</th><th style={thStyle}>Thickness</th>
          <th style={thStyle}>Concrete</th><th style={thStyle}>Mesh</th>
          <th style={thStyle}>DPM</th><th style={thStyle}>Soil Poison</th>
          <th style={thStyle}>Screed</th><th style={thStyle}>Tiles</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeSurfaceBedTypes.map((sb) => (
            <tr key={sb.id}>
              <td style={tdStyle}>{sb.name}</td>
              <td style={tdStyle}>{sb.category}</td>
              <td style={tdStyle}>{sb.thickness}mm</td>
              <td style={tdStyle}>{sb.concreteClass}</td>
              <td style={tdStyle}>{sb.meshType}</td>
              <td style={tdStyle}>{sb.dpm ? "Yes" : "No"}</td>
              <td style={tdStyle}>{sb.soilPoison ? "Yes" : "No"}</td>
              <td style={tdStyle}>{sb.screedRequired ? `${sb.screedThickness}mm` : "No"}</td>
              <td style={tdStyle}>{sb.tileRequired ? `R${sb.tilePcSum}` : "No"}</td>
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
        <input placeholder="Mark (e.g., SB1)" value={safeNewSurfaceBedMeas.mark} onChange={(e) => updateSurfaceBedMeas({ mark: e.target.value })} />
        <select value={safeNewSurfaceBedMeas.surfaceBedTypeId} onChange={(e) => updateSurfaceBedMeas({ surfaceBedTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeSurfaceBedTypes.map((sb) => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
        </select>
        <input type="number" placeholder="Area (m²)" value={safeNewSurfaceBedMeas.area || ''} onChange={(e) => updateSurfaceBedMeas({ area: Number(e.target.value) || 0 })} />
        <button onClick={addSurfaceBedMeasurement}>
          {editingSurfaceBedMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingSurfaceBedMeasurementId !== null && (
          <button onClick={() => { setEditingSurfaceBedMeasurementId(null); resetSurfaceBedMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th><th style={thStyle}>Type</th><th style={thStyle}>Area (m²)</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeSurfaceBedMeasurements.map((m) => {
            const sb = safeSurfaceBedTypes.find((s) => s.id === m.surfaceBedTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{sb?.name}</td>
                <td style={tdStyle}>{m.area}</td>
                <td style={tdStyle}>
                  <button onClick={() => editSurfaceBedMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteSurfaceBedMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}