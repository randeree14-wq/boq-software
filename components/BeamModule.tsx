"use client";

import type { BeamType, BeamMeasurement } from "@/types/boq";

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

  const addBeamMeasurement = () => {
    if (!newBeamMeas.mark.trim() || newBeamMeas.beamTypeId === 0 || newBeamMeas.length <= 0) return;
    setBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newBeamMeas }]);
    resetBeamMeas();
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
        <button onClick={saveBeamType}>{editingBeamId !== null ? "Update" : "Save"}</button>
      </div>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Name</th><th style={thStyle}>Width</th><th style={thStyle}>Depth</th><th style={thStyle}>Reinf</th><th style={thStyle}>Formwork</th><th style={thStyle}>Concrete</th><th style={thStyle}>Actions</th></tr>
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
        <select value={newBeamMeas.beamTypeId} onChange={(e) => updateBeamMeas({ beamTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {beamTypes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={newBeamMeas.length} onChange={(e) => updateBeamMeas({ length: Number(e.target.value) })} />
        <button onClick={addBeamMeasurement}>Add</button>
      </div>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr><th style={thStyle}>Mark</th><th style={thStyle}>Beam Type</th><th style={thStyle}>Length</th></tr></thead>
        <tbody>
          {beamMeasurements.map((m) => {
            const beam = beamTypes.find((b) => b.id === m.beamTypeId);
            return <tr key={m.id}><td style={tdStyle}>{m.mark}</td><td style={tdStyle}>{beam?.name}</td><td style={tdStyle}>{m.length}</td></tr>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BeamModule;