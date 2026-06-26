"use client";

import type { BeamType, BeamMeasurement, BeamProfileType, ProppingHeightBand } from "@/types/boq";

interface BeamModuleProps {
  beamTypes: BeamType[];
  setBeamTypes: React.Dispatch<React.SetStateAction<BeamType[]>>;
  editingBeamId: number | null;
  setEditingBeamId: React.Dispatch<React.SetStateAction<number | null>>;
  newBeam: Omit<BeamType, "id">;
  updateBeam: (partial: Partial<Omit<BeamType, "id">>) => void;
  resetBeam: () => void;
  beamMeasurements: BeamMeasurement[];
  setBeamMeasurements: React.Dispatch<React.SetStateAction<BeamMeasurement[]>>;
  newBeamMeas: Omit<BeamMeasurement, "id">;
  updateBeamMeas: (partial: Partial<Omit<BeamMeasurement, "id">>) => void;
  resetBeamMeas: () => void;
  editingBeamMeasurementId: number | null;
  setEditingBeamMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
}

export default function BeamModule({
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
  styles,
}: BeamModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};

  // SAFEGUARD: Safe versions of all props
  const safeNewBeam = {
    name: newBeam?.name || "",
    width: newBeam?.width || 0,
    depth: newBeam?.depth || 0,
    reinfKg: newBeam?.reinfKg || 0,
    formworkFinish: newBeam?.formworkFinish || "Smooth",
    concreteClass: newBeam?.concreteClass || "25MPa/19mm",
    beamProfileType: newBeam?.beamProfileType || "Downstand Beam",
    beamWidthMm: newBeam?.beamWidthMm || 0,
    downstandDepthMm: newBeam?.downstandDepthMm || 0,
    upstandHeightMm: newBeam?.upstandHeightMm || 0,
    slabThicknessMm: newBeam?.slabThicknessMm || 0,
    proppingHeightBand: newBeam?.proppingHeightBand || "Not exceeding 1.5m",
    customProppingHeightDescription: newBeam?.customProppingHeightDescription || "",
  };

  const safeNewBeamMeas = {
    mark: newBeamMeas?.mark || "",
    beamTypeId: newBeamMeas?.beamTypeId || 0,
    length: newBeamMeas?.length || 0,
  };

  const safeBeamTypes = beamTypes || [];
  const safeBeamMeasurements = beamMeasurements || [];

  const saveBeamType = () => {
    if (!safeNewBeam.name.trim()) return;
    if (editingBeamId !== null) {
      setBeamTypes((prev) => prev.map((b) => (b.id === editingBeamId ? { ...b, ...safeNewBeam } : b)));
      setEditingBeamId(null);
    } else {
      setBeamTypes((prev) => [...prev, { id: Date.now(), ...safeNewBeam }]);
    }
    resetBeam();
  };

  const editBeamType = (id: number) => {
    const beam = safeBeamTypes.find((b) => b.id === id);
    if (beam) {
      updateBeam(beam);
      setEditingBeamId(id);
    }
  };

  const deleteBeamType = (id: number) => {
    setBeamTypes((prev) => prev.filter((b) => b.id !== id));
    setBeamMeasurements((prev) => prev.filter((m) => m.beamTypeId !== id));
  };

  const addBeamMeasurement = () => {
    if (!safeNewBeamMeas.mark.trim() || safeNewBeamMeas.beamTypeId === 0 || !safeNewBeamMeas.length || safeNewBeamMeas.length <= 0) return;
    const measurement = {
      id: Date.now(),
      ...safeNewBeamMeas,
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
  };

  const editBeamMeasurement = (id: number) => {
    const measurement = safeBeamMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateBeamMeas(measurement);
      setEditingBeamMeasurementId(id);
    }
  };

  const deleteBeamMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setBeamMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingBeamMeasurementId === id) {
        setEditingBeamMeasurementId(null);
        resetBeamMeas();
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Beam Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewBeam.name} onChange={(e) => updateBeam({ name: e.target.value })} />
        <select value={safeNewBeam.beamProfileType} onChange={(e) => updateBeam({ beamProfileType: e.target.value as BeamProfileType })}>
          <option>Downstand Beam</option>
          <option>Upstand Beam</option>
          <option>Perimeter Beam (Downstand Only)</option>
          <option>Perimeter Beam (Downstand + Upstand)</option>
          <option>Combined Downstand / Inverted Beam</option>
          <option>Integrated Beam / No Separate Beam Formwork</option>
        </select>
        <input type="number" placeholder="Beam width (mm)" value={safeNewBeam.beamWidthMm || ''} onChange={(e) => updateBeam({ beamWidthMm: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Downstand depth (mm)" value={safeNewBeam.downstandDepthMm || ''} onChange={(e) => updateBeam({ downstandDepthMm: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Upstand height (mm)" value={safeNewBeam.upstandHeightMm || ''} onChange={(e) => updateBeam({ upstandHeightMm: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Slab thickness (mm)" value={safeNewBeam.slabThicknessMm || ''} onChange={(e) => updateBeam({ slabThicknessMm: Number(e.target.value) || 0 })} />
        <select value={safeNewBeam.concreteClass} onChange={(e) => updateBeam({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option><option>40MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinforcement (kg/m³)" value={safeNewBeam.reinfKg || ''} onChange={(e) => updateBeam({ reinfKg: Number(e.target.value) || 0 })} />
        <select value={safeNewBeam.formworkFinish} onChange={(e) => updateBeam({ formworkFinish: e.target.value })}>
          <option>Smooth</option><option>Rough</option><option>Fair Faced</option>
        </select>
        <select value={safeNewBeam.proppingHeightBand} onChange={(e) => updateBeam({ proppingHeightBand: e.target.value as ProppingHeightBand })}>
          <option>Not exceeding 1.5m</option>
          <option>Exceeding 1.5m and not exceeding 3.5m</option>
          <option>Exceeding 3.5m and not exceeding 5.0m</option>
          <option>Exceeding 5.0m and not exceeding 6.5m</option>
          <option>Custom</option>
        </select>
        {safeNewBeam.proppingHeightBand === "Custom" && (
          <input placeholder="Custom description" value={safeNewBeam.customProppingHeightDescription} onChange={(e) => updateBeam({ customProppingHeightDescription: e.target.value })} />
        )}
        <button onClick={saveBeamType}>{editingBeamId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th><th style={thStyle}>Profile</th>
          <th style={thStyle}>Beam W</th><th style={thStyle}>Downstand</th>
          <th style={thStyle}>Upstand</th><th style={thStyle}>Slab</th>
          <th style={thStyle}>Concrete</th><th style={thStyle}>Reinf</th>
          <th style={thStyle}>Formwork</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeBeamTypes.map((beam) => (
            <tr key={beam.id}>
              <td style={tdStyle}>{beam.name}</td>
              <td style={tdStyle}>{beam.beamProfileType}</td>
              <td style={tdStyle}>{beam.beamWidthMm || 0}mm</td>
              <td style={tdStyle}>{beam.downstandDepthMm || 0}mm</td>
              <td style={tdStyle}>{beam.upstandHeightMm || 0}mm</td>
              <td style={tdStyle}>{beam.slabThicknessMm || 0}mm</td>
              <td style={tdStyle}>{beam.concreteClass}</td>
              <td style={tdStyle}>{beam.reinfKg || 0}kg</td>
              <td style={tdStyle}>{beam.formworkFinish}</td>
              <td style={tdStyle}>
                <button onClick={() => editBeamType(beam.id)}>Edit</button>
                <button onClick={() => deleteBeamType(beam.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>Beam Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark (e.g., B1)" value={safeNewBeamMeas.mark} onChange={(e) => updateBeamMeas({ mark: e.target.value })} />
        <select value={safeNewBeamMeas.beamTypeId} onChange={(e) => updateBeamMeas({ beamTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeBeamTypes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={safeNewBeamMeas.length || ''} onChange={(e) => updateBeamMeas({ length: Number(e.target.value) || 0 })} />
        <button onClick={addBeamMeasurement}>
          {editingBeamMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingBeamMeasurementId !== null && (
          <button onClick={() => { setEditingBeamMeasurementId(null); resetBeamMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th><th style={thStyle}>Type</th><th style={thStyle}>Length (m)</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeBeamMeasurements.map((m) => {
            const beam = safeBeamTypes.find((b) => b.id === m.beamTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{beam?.name}</td>
                <td style={tdStyle}>{m.length}</td>
                <td style={tdStyle}>
                  <button onClick={() => editBeamMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteBeamMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}