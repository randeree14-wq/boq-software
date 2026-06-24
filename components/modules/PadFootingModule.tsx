"use client";

import type { PadFootingType, PadFootingMeasurement } from "@/types/boq";

interface PadFootingModuleProps {
  padFootingTypes: PadFootingType[];
  setPadFootingTypes: React.Dispatch<React.SetStateAction<PadFootingType[]>>;
  editingPadFootingId: number | null;
  setEditingPadFootingId: React.Dispatch<React.SetStateAction<number | null>>;
  newPadFooting: Omit<PadFootingType, "id">;
  updatePadFooting: (partial: Partial<Omit<PadFootingType, "id">>) => void;
  resetPadFooting: () => void;
  padFootingMeasurements: PadFootingMeasurement[];
  setPadFootingMeasurements: React.Dispatch<React.SetStateAction<PadFootingMeasurement[]>>;
  newPadFootingMeas: Omit<PadFootingMeasurement, "id">;
  updatePadFootingMeas: (partial: Partial<Omit<PadFootingMeasurement, "id">>) => void;
  resetPadFootingMeas: () => void;
  editingPadFootingMeasurementId: number | null;
  setEditingPadFootingMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
}

const PadFootingModule = ({
  padFootingTypes,
  setPadFootingTypes,
  editingPadFootingId,
  setEditingPadFootingId,
  newPadFooting,
  updatePadFooting,
  resetPadFooting,
  padFootingMeasurements,
  setPadFootingMeasurements,
  newPadFootingMeas,
  updatePadFootingMeas,
  resetPadFootingMeas,
  editingPadFootingMeasurementId,
  setEditingPadFootingMeasurementId,
  styles,
}: PadFootingModuleProps) => {
  const savePadFootingType = () => {
    if (!newPadFooting.name.trim()) return;
    if (editingPadFootingId !== null) {
      setPadFootingTypes((prev) => prev.map((pf) => (pf.id === editingPadFootingId ? { ...pf, ...newPadFooting } : pf)));
      setEditingPadFootingId(null);
    } else {
      setPadFootingTypes((prev) => [...prev, { id: Date.now(), ...newPadFooting }]);
    }
    resetPadFooting();
  };

  const editPadFootingType = (id: number) => {
    const pf = padFootingTypes.find((p) => p.id === id);
    if (pf) {
      updatePadFooting(pf);
      setEditingPadFootingId(id);
    }
  };

  const deletePadFootingType = (id: number) => {
    setPadFootingTypes((prev) => prev.filter((pf) => pf.id !== id));
    setPadFootingMeasurements((prev) => prev.filter((m) => m.padFootingTypeId !== id));
  };

  const savePadFootingMeasurement = () => {
    if (!newPadFootingMeas.mark.trim() || newPadFootingMeas.padFootingTypeId === 0 || !newPadFootingMeas.quantity || newPadFootingMeas.quantity <= 0) return;
    if (editingPadFootingMeasurementId !== null) {
      setPadFootingMeasurements((prev) =>
        prev.map((m) => (m.id === editingPadFootingMeasurementId ? { ...m, ...newPadFootingMeas } : m))
      );
      setEditingPadFootingMeasurementId(null);
    } else {
      setPadFootingMeasurements((prev) => [...prev, { id: Date.now(), ...newPadFootingMeas }]);
    }
    resetPadFootingMeas();
  };

  const editPadFootingMeasurement = (id: number) => {
    const measurement = padFootingMeasurements.find((m) => m.id === id);
    if (measurement) {
      updatePadFootingMeas(measurement);
      setEditingPadFootingMeasurementId(id);
    }
  };

  const deletePadFootingMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setPadFootingMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingPadFootingMeasurementId === id) {
        setEditingPadFootingMeasurementId(null);
        resetPadFootingMeas();
      }
    }
  };

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  return (
    <div style={cardStyle}>
      <h1>Pad Footing Module</h1>
      <h2>Pad Footing Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newPadFooting.name} onChange={(e) => updatePadFooting({ name: e.target.value })} />
        <input type="number" placeholder="Pad length (mm) e.g., 1200" value={newPadFooting.padLength || ''} onChange={(e) => updatePadFooting({ padLength: Number(e.target.value) })} />
        <input type="number" placeholder="Pad width (mm) e.g., 1000" value={newPadFooting.padWidth || ''} onChange={(e) => updatePadFooting({ padWidth: Number(e.target.value) })} />
        <input type="number" placeholder="Pad Depth (mm) e.g., 300" value={newPadFooting.padDepth || ''} onChange={(e) => updatePadFooting({ padDepth: Number(e.target.value) })} />
        <input type="number" placeholder="Excavation Length (mm) e.g., 1800" value={newPadFooting.excavationLength || ''} onChange={(e) => updatePadFooting({ excavationLength: Number(e.target.value) })} />
        <input type="number" placeholder="Excavation Width (mm) e.g., 1800" value={newPadFooting.excavationWidth || ''} onChange={(e) => updatePadFooting({ excavationWidth: Number(e.target.value) })} />
        <input type="number" placeholder="Excavation Depth (mm) e.g., 800" value={newPadFooting.excavationDepth || ''} onChange={(e) => updatePadFooting({ excavationDepth: Number(e.target.value) })} />
        <select value={newPadFooting.concreteClass} onChange={(e) => updatePadFooting({ concreteClass: e.target.value })}>
          <option>25MPa/19mm</option><option>30MPa/19mm</option><option>35MPa/19mm</option>
        </select>
        <input type="number" placeholder="Reinforcement (kg/m³) e.g., 120" value={newPadFooting.reinfKg || ''} onChange={(e) => updatePadFooting({ reinfKg: Number(e.target.value) })} />
        <label><input type="checkbox" checked={newPadFooting.formworkRequired} onChange={(e) => updatePadFooting({ formworkRequired: e.target.checked })} /> Formwork Required</label>
        <label><input type="checkbox" checked={newPadFooting.blindingRequired} onChange={(e) => updatePadFooting({ blindingRequired: e.target.checked })} /> Blinding Required</label>
        <input type="number" placeholder="Blinding thickness (mm) e.g., 50" value={newPadFooting.blindingThickness || ''} onChange={(e) => updatePadFooting({ blindingThickness: Number(e.target.value) })} />
        <label><input type="checkbox" checked={newPadFooting.soilPoison} onChange={(e) => updatePadFooting({ soilPoison: e.target.checked })} /> Soil Poison</label>
        <label><input type="checkbox" checked={newPadFooting.backfill} onChange={(e) => updatePadFooting({ backfill: e.target.checked })} /> Backfill</label>
        
        {/* New checkboxes for Working Space and Risk of Collapse */}
        <label>
  <input
    type="checkbox"
    checked={newPadFooting.workingSpaceRequired || false}
    onChange={(e) => updatePadFooting({ workingSpaceRequired: e.target.checked })}
  />
  Working space required
</label>
<label>
  <input
    type="checkbox"
    checked={newPadFooting.riskOfCollapseRequired || false}
    onChange={(e) => updatePadFooting({ riskOfCollapseRequired: e.target.checked })}
  />
  Risk of collapse required
</label>

        <button onClick={savePadFootingType}>{editingPadFootingId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Pad Size</th>
            <th style={thStyle}>Excavation</th>
            <th style={thStyle}>Concrete</th>
            <th style={thStyle}>Reinf</th>
            <th style={thStyle}>Formwork</th>
            <th style={thStyle}>Blinding</th>
            <th style={thStyle}>Soil</th>
            <th style={thStyle}>Backfill</th>
            <th style={thStyle}>Working</th>
            <th style={thStyle}>Risk</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {padFootingTypes.map((pf) => (
            <tr key={pf.id}>
              <td style={tdStyle}>{pf.name}</td>
              <td style={tdStyle}>{pf.padLength || '-'}x{pf.padWidth || '-'}x{pf.padDepth || '-'}</td>
              <td style={tdStyle}>{pf.excavationLength || '-'}x{pf.excavationWidth || '-'}x{pf.excavationDepth || '-'}</td>
              <td style={tdStyle}>{pf.concreteClass}</td>
              <td style={tdStyle}>{pf.reinfKg || '-'}</td>
              <td style={tdStyle}>{pf.formworkRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{pf.blindingRequired ? `${pf.blindingThickness || '-'}mm` : "No"}</td>
              <td style={tdStyle}>{pf.soilPoison ? "Yes" : "No"}</td>
              <td style={tdStyle}>{pf.backfill ? "Yes" : "No"}</td>
              <td style={tdStyle}>{pf.workingSpaceRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{pf.riskOfCollapseRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>
                <button onClick={() => editPadFootingType(pf.id)}>Edit</button>
                <button onClick={() => deletePadFootingType(pf.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h2>Pad Footing Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark (e.g., PF1)" value={newPadFootingMeas.mark} onChange={(e) => updatePadFootingMeas({ mark: e.target.value })} />
        <select value={newPadFootingMeas.padFootingTypeId} onChange={(e) => updatePadFootingMeas({ padFootingTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {padFootingTypes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={newPadFootingMeas.quantity || ''} onChange={(e) => updatePadFootingMeas({ quantity: Number(e.target.value) })} />
        <button onClick={savePadFootingMeasurement}>
          {editingPadFootingMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingPadFootingMeasurementId !== null && (
          <button onClick={() => { setEditingPadFootingMeasurementId(null); resetPadFootingMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Pad Type</th><th style={thStyle}>Quantity</th><th style={thStyle}>Actions</th></tr>
        </thead>
        <tbody>
          {padFootingMeasurements.map((m) => {
            const pf = padFootingTypes.find((p) => p.id === m.padFootingTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{pf?.name}</td>
                <td style={tdStyle}>{m.quantity}</td>
                <td style={tdStyle}>
                  <button onClick={() => editPadFootingMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deletePadFootingMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PadFootingModule;