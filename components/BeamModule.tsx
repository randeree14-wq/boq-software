"use client";

import type { 
  BeamType, 
  BeamMeasurement, 
  BeamProfileType, 
  ProppingHeightBand 
} from "@/types/boq";

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

const BeamModule = ({
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
}: BeamModuleProps) => {
  const saveBeamType = () => {
    if (!newBeam.name.trim()) return;
    
    // Validate required fields
    if (!newBeam.beamWidthMm || newBeam.beamWidthMm <= 0) {
      alert("Please enter a valid Beam Width");
      return;
    }
    
    if (editingBeamId !== null) {
      setBeamTypes((prev) => prev.map((b) => (b.id === editingBeamId ? { ...b, ...newBeam } : b)));
      setEditingBeamId(null);
    } else {
      setBeamTypes((prev) => [...prev, { id: Date.now(), ...newBeam }]);
    }
    resetBeam();
  };

  const editBeamType = (id: number) => {
    const beam = beamTypes.find((b) => b.id === id);
    if (beam) {
      updateBeam(beam);
      setEditingBeamId(id);
    }
  };

  const deleteBeamType = (id: number) => {
    setBeamTypes((prev) => prev.filter((b) => b.id !== id));
    setBeamMeasurements((prev) => prev.filter((m) => m.beamTypeId !== id));
  };

  const saveBeamMeasurement = () => {
    if (!newBeamMeas.mark.trim() || newBeamMeas.beamTypeId === 0 || !newBeamMeas.length || newBeamMeas.length <= 0) return;
    
    if (editingBeamMeasurementId !== null) {
      setBeamMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingBeamMeasurementId ? { ...m, ...newBeamMeas } : m
        )
      );
      setEditingBeamMeasurementId(null);
    } else {
      setBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newBeamMeas }]);
    }
    resetBeamMeas();
  };

  const editBeamMeasurement = (id: number) => {
    const measurement = beamMeasurements.find((m) => m.id === id);
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

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  const profileType = newBeam.beamProfileType || "Downstand Beam";
  const showFormwork = profileType !== "Integrated Beam / No Separate Beam Formwork";
  const showPropping = showFormwork;

  return (
    <div style={cardStyle}>
      <h1>Beam Module</h1>
      <h2>Beam Type Library</h2>
      <div style={formGridStyle}>
        <input 
          placeholder="Beam type name (e.g., Main Roof Beam)" 
          value={newBeam.name} 
          onChange={(e) => updateBeam({ name: e.target.value })} 
        />
        
        <input 
          type="number" 
          placeholder="Reinforcement kg/m³ (e.g., 120)" 
          value={newBeam.reinfKg || ''} 
          onChange={(e) => updateBeam({ reinfKg: Number(e.target.value) })} 
        />
        
        <select value={newBeam.concreteClass} onChange={(e) => updateBeam({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option>
          <option>30MPa/19mm</option>
          <option>35MPa/19mm</option>
        </select>

        <select 
          value={profileType} 
          onChange={(e) => updateBeam({ beamProfileType: e.target.value as BeamProfileType })}
        >
          <option value="Downstand Beam">Downstand Beam</option>
          <option value="Upstand Beam">Upstand Beam</option>
          <option value="Perimeter Beam (Downstand Only)">Perimeter Beam (Downstand Only)</option>
          <option value="Perimeter Beam (Downstand + Upstand)">Perimeter Beam (Downstand + Upstand)</option>
          <option value="Combined Downstand / Inverted Beam">Combined Downstand / Inverted Beam</option>
          <option value="Integrated Beam / No Separate Beam Formwork">Integrated Beam (no separate formwork)</option>
        </select>

        <input 
          type="number" 
          placeholder="Beam width (mm) e.g., 230" 
          value={newBeam.beamWidthMm || ''} 
          onChange={(e) => updateBeam({ beamWidthMm: Number(e.target.value) })} 
        />

        {(profileType === "Downstand Beam" || 
          profileType === "Perimeter Beam (Downstand Only)" || 
          profileType === "Perimeter Beam (Downstand + Upstand)" ||
          profileType === "Combined Downstand / Inverted Beam") && (
          <input 
            type="number" 
            placeholder="Downstand depth (mm) e.g., 400" 
            value={newBeam.downstandDepthMm || ''} 
            onChange={(e) => updateBeam({ downstandDepthMm: Number(e.target.value) })} 
          />
        )}

        {(profileType === "Upstand Beam" || 
          profileType === "Perimeter Beam (Downstand + Upstand)" ||
          profileType === "Combined Downstand / Inverted Beam") && (
          <input 
            type="number" 
            placeholder="Upstand height (mm) e.g., 300" 
            value={newBeam.upstandHeightMm || ''} 
            onChange={(e) => updateBeam({ upstandHeightMm: Number(e.target.value) })} 
          />
        )}

        {profileType === "Combined Downstand / Inverted Beam" && (
          <input 
            type="number" 
            placeholder="Slab thickness (mm) e.g., 150" 
            value={newBeam.slabThicknessMm || ''} 
            onChange={(e) => updateBeam({ slabThicknessMm: Number(e.target.value) })} 
          />
        )}

        {showFormwork && (
          <select value={newBeam.formworkFinish || "Smooth"} onChange={(e) => updateBeam({ formworkFinish: e.target.value })}>
            <option>Smooth</option>
            <option>Rough</option>
            <option>Special</option>
          </select>
        )}

        {showPropping && (
          <>
            <select 
              value={newBeam.proppingHeightBand || "Not exceeding 1.5m"} 
              onChange={(e) => updateBeam({ proppingHeightBand: e.target.value as ProppingHeightBand })}
            >
              <option value="Not exceeding 1.5m">Not exceeding 1.5m</option>
              <option value="Exceeding 1.5m and not exceeding 3.5m">Exceeding 1.5m and not exceeding 3.5m</option>
              <option value="Exceeding 3.5m and not exceeding 5.0m">Exceeding 3.5m and not exceeding 5.0m</option>
              <option value="Exceeding 5.0m and not exceeding 6.5m">Exceeding 5.0m and not exceeding 6.5m</option>
              <option value="Custom">Custom</option>
            </select>
            
            {newBeam.proppingHeightBand === "Custom" && (
              <input 
                placeholder="Custom propping height (e.g., 2.8m high)" 
                value={newBeam.customProppingHeightDescription || ""} 
                onChange={(e) => updateBeam({ customProppingHeightDescription: e.target.value })}
              />
            )}
          </>
        )}

        <button onClick={saveBeamType}>{editingBeamId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Reinf</th>
            <th style={thStyle}>Profile</th>
            <th style={thStyle}>Width</th>
            <th style={thStyle}>Downstand</th>
            <th style={thStyle}>Upstand</th>
            <th style={thStyle}>Slab</th>
            <th style={thStyle}>Finish</th>
            <th style={thStyle}>Concrete</th>
            <th style={thStyle}>Propping</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {beamTypes.map((beam) => (
            <tr key={beam.id}>
              <td style={tdStyle}>{beam.name}</td>
              <td style={tdStyle}>{beam.reinfKg}</td>
              <td style={tdStyle}>{beam.beamProfileType || "Downstand Beam"}</td>
              <td style={tdStyle}>{beam.beamWidthMm || "-"}mm</td>
              <td style={tdStyle}>{beam.downstandDepthMm || "-"}mm</td>
              <td style={tdStyle}>{beam.upstandHeightMm || "-"}mm</td>
              <td style={tdStyle}>{beam.slabThicknessMm || "-"}mm</td>
              <td style={tdStyle}>{beam.formworkFinish}</td>
              <td style={tdStyle}>{beam.concreteClass}</td>
              <td style={tdStyle}>{beam.proppingHeightBand === "Custom" ? beam.customProppingHeightDescription || "Custom" : beam.proppingHeightBand || "Not exceeding 1.5m"}</td>
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
        <input 
          placeholder="Mark (e.g., B1, B2)" 
          value={newBeamMeas.mark} 
          onChange={(e) => updateBeamMeas({ mark: e.target.value })} 
        />
        <select value={newBeamMeas.beamTypeId} onChange={(e) => updateBeamMeas({ beamTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {beamTypes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input 
          type="number" 
          placeholder="Length (m) e.g., 5.5" 
          value={newBeamMeas.length || ''} 
          onChange={(e) => updateBeamMeas({ length: Number(e.target.value) })} 
        />
        <button onClick={saveBeamMeasurement}>
          {editingBeamMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingBeamMeasurementId !== null && (
          <button onClick={() => { setEditingBeamMeasurementId(null); resetBeamMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Beam Type</th><th style={thStyle}>Length</th><th style={thStyle}>Actions</th></tr>
        </thead>
        <tbody>
          {beamMeasurements.map((m) => {
            const beam = beamTypes.find((b) => b.id === m.beamTypeId);
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
};

export default BeamModule;