"use client";

import type { GroundBeamType, GroundBeamMeasurement } from "@/types/boq";

interface GroundBeamModuleProps {
  groundBeamTypes: GroundBeamType[];
  setGroundBeamTypes: React.Dispatch<React.SetStateAction<GroundBeamType[]>>;
  editingGroundBeamId: number | null;
  setEditingGroundBeamId: React.Dispatch<React.SetStateAction<number | null>>;
  newGroundBeam: Omit<GroundBeamType, "id">;
  updateGroundBeam: (partial: Partial<Omit<GroundBeamType, "id">>) => void;
  resetGroundBeam: () => void;
  groundBeamMeasurements: GroundBeamMeasurement[];
  setGroundBeamMeasurements: React.Dispatch<React.SetStateAction<GroundBeamMeasurement[]>>;
  newGroundBeamMeas: Omit<GroundBeamMeasurement, "id">;
  updateGroundBeamMeas: (partial: Partial<Omit<GroundBeamMeasurement, "id">>) => void;
  resetGroundBeamMeas: () => void;
  editingGroundBeamMeasurementId: number | null;
  setEditingGroundBeamMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
}

const GroundBeamModule = ({
  groundBeamTypes,
  setGroundBeamTypes,
  editingGroundBeamId,
  setEditingGroundBeamId,
  newGroundBeam,
  updateGroundBeam,
  resetGroundBeam,
  groundBeamMeasurements,
  setGroundBeamMeasurements,
  newGroundBeamMeas,
  updateGroundBeamMeas,
  resetGroundBeamMeas,
  editingGroundBeamMeasurementId,
  setEditingGroundBeamMeasurementId,
  styles,
}: GroundBeamModuleProps) => {
  const saveGroundBeamType = () => {
    if (!newGroundBeam.name.trim()) return;
    if (editingGroundBeamId !== null) {
      setGroundBeamTypes((prev) => prev.map((gb) => (gb.id === editingGroundBeamId ? { ...gb, ...newGroundBeam } : gb)));
      setEditingGroundBeamId(null);
    } else {
      setGroundBeamTypes((prev) => [...prev, { id: Date.now(), ...newGroundBeam }]);
    }
    resetGroundBeam();
  };

  const editGroundBeamType = (id: number) => {
    const gb = groundBeamTypes.find((g) => g.id === id);
    if (gb) {
      updateGroundBeam(gb);
      setEditingGroundBeamId(id);
    }
  };

  const deleteGroundBeamType = (id: number) => {
    setGroundBeamTypes((prev) => prev.filter((gb) => gb.id !== id));
    setGroundBeamMeasurements((prev) => prev.filter((m) => m.groundBeamTypeId !== id));
  };

  const saveGroundBeamMeasurement = () => {
    if (!newGroundBeamMeas.mark.trim() || newGroundBeamMeas.groundBeamTypeId === 0 || newGroundBeamMeas.length <= 0) return;
    
    if (editingGroundBeamMeasurementId !== null) {
      setGroundBeamMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingGroundBeamMeasurementId ? { ...m, ...newGroundBeamMeas } : m
        )
      );
      setEditingGroundBeamMeasurementId(null);
    } else {
      setGroundBeamMeasurements((prev) => [...prev, { id: Date.now(), ...newGroundBeamMeas }]);
    }
    resetGroundBeamMeas();
  };

  const editGroundBeamMeasurement = (id: number) => {
    const measurement = groundBeamMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateGroundBeamMeas(measurement);
      setEditingGroundBeamMeasurementId(id);
    }
  };

  const deleteGroundBeamMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setGroundBeamMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingGroundBeamMeasurementId === id) {
        setEditingGroundBeamMeasurementId(null);
        resetGroundBeamMeas();
      }
    }
  };

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  return (
    <div style={cardStyle}>
      <h1>Ground Beam Module</h1>
      <h2>Ground Beam Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newGroundBeam.name} onChange={(e) => updateGroundBeam({ name: e.target.value })} />
        <input type="number" placeholder="Trench Width mm" value={newGroundBeam.trenchWidth} onChange={(e) => updateGroundBeam({ trenchWidth: Number(e.target.value) })} />
        <input type="number" placeholder="Trench Depth mm" value={newGroundBeam.trenchDepth} onChange={(e) => updateGroundBeam({ trenchDepth: Number(e.target.value) })} />
        <input type="number" placeholder="Beam Width mm" value={newGroundBeam.beamWidth} onChange={(e) => updateGroundBeam({ beamWidth: Number(e.target.value) })} />
        <input type="number" placeholder="Beam Depth mm" value={newGroundBeam.beamDepth} onChange={(e) => updateGroundBeam({ beamDepth: Number(e.target.value) })} />
        <select value={newGroundBeam.concreteClass} onChange={(e) => updateGroundBeam({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinf kg/m³" value={newGroundBeam.reinfKgPerM3} onChange={(e) => updateGroundBeam({ reinfKgPerM3: Number(e.target.value) })} />
        <label><input type="checkbox" checked={newGroundBeam.formworkRequired} onChange={(e) => updateGroundBeam({ formworkRequired: e.target.checked })} /> Formwork</label>
        <label><input type="checkbox" checked={newGroundBeam.blindingRequired} onChange={(e) => updateGroundBeam({ blindingRequired: e.target.checked })} /> Blinding</label>
        <input type="number" placeholder="Blinding thickness mm" value={newGroundBeam.blindingThickness} onChange={(e) => updateGroundBeam({ blindingThickness: Number(e.target.value) })} />
        <label><input type="checkbox" checked={newGroundBeam.backfillRequired} onChange={(e) => updateGroundBeam({ backfillRequired: e.target.checked })} /> Backfill</label>
        <label><input type="checkbox" checked={newGroundBeam.dpcRequired} onChange={(e) => updateGroundBeam({ dpcRequired: e.target.checked })} /> DPC</label>
        <label><input type="checkbox" checked={newGroundBeam.soilPoisonRequired} onChange={(e) => updateGroundBeam({ soilPoisonRequired: e.target.checked })} /> Soil Poison</label>
        <button onClick={saveGroundBeamType}>{editingGroundBeamId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th><th style={thStyle}>Trench</th><th style={thStyle}>Beam</th>
            <th style={thStyle}>Concrete</th><th style={thStyle}>Reinf</th><th style={thStyle}>Formwork</th>
            <th style={thStyle}>Blinding</th><th style={thStyle}>Backfill</th><th style={thStyle}>DPC</th>
            <th style={thStyle}>Soil</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groundBeamTypes.map((gb) => (
            <tr key={gb.id}>
              <td style={tdStyle}>{gb.name}</td>
              <td style={tdStyle}>{gb.trenchWidth}x{gb.trenchDepth}</td>
              <td style={tdStyle}>{gb.beamWidth}x{gb.beamDepth}</td>
              <td style={tdStyle}>{gb.concreteClass}</td>
              <td style={tdStyle}>{gb.reinfKgPerM3}</td>
              <td style={tdStyle}>{gb.formworkRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{gb.blindingRequired ? `${gb.blindingThickness}mm` : "No"}</td>
              <td style={tdStyle}>{gb.backfillRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{gb.dpcRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{gb.soilPoisonRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>
                <button onClick={() => editGroundBeamType(gb.id)}>Edit</button>
                <button onClick={() => deleteGroundBeamType(gb.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h2>Ground Beam Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark" value={newGroundBeamMeas.mark} onChange={(e) => updateGroundBeamMeas({ mark: e.target.value })} />
        <select value={newGroundBeamMeas.groundBeamTypeId} onChange={(e) => updateGroundBeamMeas({ groundBeamTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {groundBeamTypes.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={newGroundBeamMeas.length} onChange={(e) => updateGroundBeamMeas({ length: Number(e.target.value) })} />
        <button onClick={saveGroundBeamMeasurement}>
          {editingGroundBeamMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingGroundBeamMeasurementId !== null && (
          <button onClick={() => { setEditingGroundBeamMeasurementId(null); resetGroundBeamMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Ground Beam Type</th><th style={thStyle}>Length</th><th style={thStyle}>Actions</th></tr>
        </thead>
        <tbody>
          {groundBeamMeasurements.map((m) => {
            const gb = groundBeamTypes.find((g) => g.id === m.groundBeamTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{gb?.name}</td>
                <td style={tdStyle}>{m.length}</td>
                <td style={tdStyle}>
                  <button onClick={() => editGroundBeamMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteGroundBeamMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GroundBeamModule;