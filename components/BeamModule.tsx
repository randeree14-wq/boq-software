"use client";

import type { BeamType, BeamMeasurement, BeamFormType, FormworkMeasurement, ProppingHeightBand } from "@/types/boq";

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
    if (!newBeamMeas.mark.trim() || newBeamMeas.beamTypeId === 0 || newBeamMeas.length <= 0) return;
    
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

  return (
    <div style={cardStyle}>
      <h1>Beam Module</h1>
      <h2>Beam Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newBeam.name} onChange={(e) => updateBeam({ name: e.target.value })} />
        <input type="number" placeholder="Width mm" value={newBeam.width} onChange={(e) => updateBeam({ width: Number(e.target.value) })} />
        <input type="number" placeholder="Depth mm" value={newBeam.depth} onChange={(e) => updateBeam({ depth: Number(e.target.value) })} />
        <input type="number" placeholder="Reinf kg/m³" value={newBeam.reinfKg} onChange={(e) => updateBeam({ reinfKg: Number(e.target.value) })} />
        <select value={newBeam.formworkFinish} onChange={(e) => updateBeam({ formworkFinish: e.target.value })}>
          <option>Smooth</option><option>Rough</option><option>Special</option>
        </select>
        <select value={newBeam.concreteClass} onChange={(e) => updateBeam({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
        </select>
        <select value={newBeam.beamFormType || "Downstand beam"} onChange={(e) => updateBeam({ beamFormType: e.target.value as BeamFormType })}>
          <option value="Downstand beam">Downstand beam</option>
          <option value="Perimeter downstand beam">Perimeter downstand beam</option>
          <option value="Upstand beam">Upstand beam</option>
          <option value="Integrated slab beam / no beam formwork">Integrated slab beam / no beam formwork</option>
        </select>
{/* Propping Height Band */}
{newBeam.beamFormType !== "Integrated slab beam / no beam formwork" && newBeam.formworkMeasurement !== "None" && (
  <>
    <select 
      value={newBeam.proppingHeightBand || "Not exceeding 1.5m"} 
      onChange={(e) => updateBeam({ proppingHeightBand: e.target.value as ProppingHeightBand })}
    >
      <option value="Not exceeding 1.5m">Not exceeding 1.5m</option>
      <option value="exceeding 1.5m and not exceeding 3.5m">Exceeding 1.5m and not exceeding 3.5m</option>
      <option value="exceeding 3.5m and not exceeding 5.0m">Exceeding 3.5m and not exceeding 5.0m</option>
      <option value="exceeding 5.0m and not exceeding 6.5m">Exceeding 5.0m and not exceeding 6.5m</option>
      <option value="Custom">Custom</option>
    </select>
    
    {newBeam.proppingHeightBand === "Custom" && (
      <input 
        placeholder="Custom propping height description" 
        value={newBeam.customProppingHeightDescription || ""} 
        onChange={(e) => updateBeam({ customProppingHeightDescription: e.target.value })}
      />
    )}
  </>
)}
        {newBeam.beamFormType !== "Integrated slab beam / no beam formwork" && newBeam.formworkMeasurement !== "None" && (
          <>
            <select value={newBeam.proppingHeightBand || "Not exceeding 1.5m"} onChange={(e) => updateBeam({ proppingHeightBand: e.target.value as ProppingHeightBand })}>
              <option value="Not exceeding 1.5m">Not exceeding 1.5m</option>
              <option value="exceeding 1.5m and not exceeding 3.5m">Exceeding 1.5m and not exceeding 3.5m</option>
              <option value="exceeding 3.5m and not exceeding 5.0m">Exceeding 3.5m and not exceeding 5.0m</option>
              <option value="exceeding 5.0m and not exceeding 6.5m">Exceeding 5.0m and not exceeding 6.5m</option>
              <option value="Custom">Custom</option>
            </select>
            {newBeam.proppingHeightBand === "Custom" && (
              <input placeholder="Custom propping height description" 
              value={newBeam.customProppingHeightDescription || ""} 
              onChange={(e) => updateBeam({ customProppingHeightDescription: e.target.value })} />
            )}
          </>
        )}
        <button onClick={saveBeamType}>{editingBeamId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th><th style={thStyle}>Width</th><th style={thStyle}>Depth</th>
            <th style={thStyle}>Reinf</th><th style={thStyle}>Formwork</th><th style={thStyle}>Concrete</th>
            <th style={thStyle}>Beam Form</th><th style={thStyle}>Formwork Meas.</th>
            <th style={thStyle}>Propping Height</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {beamTypes.map((beam) => (
            <tr key={beam.id}>
              <td style={tdStyle}>{beam.name}</td>
              <td style={tdStyle}>{beam.width}</td>
              <td style={tdStyle}>{beam.depth}</td>
              <td style={tdStyle}>{beam.reinfKg}</td>
              <td style={tdStyle}>{beam.formworkFinish}</td>
              <td style={tdStyle}>{beam.concreteClass}</td>
              <td style={tdStyle}>{beam.beamFormType || "Downstand beam"}</td>
              <td style={tdStyle}>{beam.formworkMeasurement || "Sides and soffit together"}</td>
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
        <input placeholder="Mark" value={newBeamMeas.mark} onChange={(e) => updateBeamMeas({ mark: e.target.value })} />

        <select 
  value={newBeam.beamProfileType || "Downstand Beam"} 
  onChange={(e) => updateBeam({ beamProfileType: e.target.value as BeamProfileType })}
>
  <option value="Downstand Beam">Downstand Beam</option>
  <option value="Upstand Beam">Upstand Beam</option>
  <option value="Perimeter Beam (Downstand Only)">Perimeter Beam (Downstand Only)</option>
  <option value="Perimeter Beam (Downstand + Upstand)">Perimeter Beam (Downstand + Upstand)</option>
  <option value="Combined Downstand / Inverted Beam">Combined Downstand / Inverted Beam</option> {/* NEW */}
  <option value="Integrated Beam / No Separate Beam Formwork">Integrated Beam / No Separate Beam Formwork</option>
</select>

        <select value={newBeamMeas.beamTypeId} onChange={(e) => updateBeamMeas({ beamTypeId: Number(e.target.value) })}>


          <option value={0}>Select Type</option>
          {beamTypes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input 
        type="number" 
        placeholder="Slab Thickness (mm)" 
        value={newBeam.slabThicknessMm || 150} 
        onChange={(e) => updateBeam({ slabThicknessMm: Number(e.target.value) })}
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