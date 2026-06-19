"use client";

import type {
  OpeningType,
  OpeningMeasurement,
  DoorConfiguration,
  DoorLeafType,
  DoorFrameType,
  WindowType,
  WindowFrameType,
  WallThicknessOption,
} from "@/types/boq";

interface OpeningsModuleProps {
  openingTypes: OpeningType[];
  setOpeningTypes: React.Dispatch<React.SetStateAction<OpeningType[]>>;
  editingOpeningId: number | null;
  setEditingOpeningId: React.Dispatch<React.SetStateAction<number | null>>;
  newOpening: Omit<OpeningType, "id">;
  updateOpening: (partial: Partial<Omit<OpeningType, "id">>) => void;
  resetOpening: () => void;
  openingMeasurements: OpeningMeasurement[];
  setOpeningMeasurements: React.Dispatch<React.SetStateAction<OpeningMeasurement[]>>;
  newOpeningMeas: Omit<OpeningMeasurement, "id">;
  updateOpeningMeas: (partial: Partial<Omit<OpeningMeasurement, "id">>) => void;
  resetOpeningMeas: () => void;
  editingOpeningMeasurementId: number | null;
  setEditingOpeningMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
}

const OpeningsModule = ({
  openingTypes,
  setOpeningTypes,
  editingOpeningId,
  setEditingOpeningId,
  newOpening,
  updateOpening,
  resetOpening,
  openingMeasurements,
  setOpeningMeasurements,
  newOpeningMeas,
  updateOpeningMeas,
  resetOpeningMeas,
  editingOpeningMeasurementId,
  setEditingOpeningMeasurementId,
  styles,
}: OpeningsModuleProps) => {
  const saveOpeningType = () => {
    if (!newOpening.name.trim()) return;
    if (editingOpeningId !== null) {
      setOpeningTypes((prev) =>
        prev.map((o) => (o.id === editingOpeningId ? { ...o, ...newOpening } : o))
      );
      setEditingOpeningId(null);
    } else {
      setOpeningTypes((prev) => [...prev, { id: Date.now(), ...newOpening }]);
    }
    resetOpening();
  };

  const editOpeningType = (id: number) => {
    const opening = openingTypes.find((o) => o.id === id);
    if (opening) {
      updateOpening(opening);
      setEditingOpeningId(id);
    }
  };

  const deleteOpeningType = (id: number) => {
    setOpeningTypes((prev) => prev.filter((o) => o.id !== id));
    setOpeningMeasurements((prev) => prev.filter((m) => m.openingTypeId !== id));
  };

  const saveOpeningMeasurement = () => {
    if (!newOpeningMeas.mark.trim() || newOpeningMeas.openingTypeId === 0 || newOpeningMeas.quantity <= 0) return;

    if (editingOpeningMeasurementId !== null) {
      setOpeningMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingOpeningMeasurementId ? { ...m, ...newOpeningMeas } : m
        )
      );
      setEditingOpeningMeasurementId(null);
    } else {
      setOpeningMeasurements((prev) => [...prev, { id: Date.now(), ...newOpeningMeas }]);
    }
    resetOpeningMeas();
  };

  const editOpeningMeasurement = (id: number) => {
    const measurement = openingMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateOpeningMeas(measurement);
      setEditingOpeningMeasurementId(id);
    }
  };

  const deleteOpeningMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setOpeningMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingOpeningMeasurementId === id) {
        setEditingOpeningMeasurementId(null);
        resetOpeningMeas();
      }
    }
  };

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  const category = newOpening.category;

  return (
    <div style={cardStyle}>
      <h1>Openings Module</h1>
      <h2>Opening Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newOpening.name} onChange={(e) => updateOpening({ name: e.target.value })} />
        <select value={newOpening.category} onChange={(e) => updateOpening({ category: e.target.value as "Door" | "Window" })}>
          <option value="Door">Door</option>
          <option value="Window">Window</option>
        </select>

        <input type="number" placeholder="Width (mm)" value={newOpening.widthMm} onChange={(e) => updateOpening({ widthMm: Number(e.target.value) })} />
        <input type="number" placeholder="Height (mm)" value={newOpening.heightMm} onChange={(e) => updateOpening({ heightMm: Number(e.target.value) })} />
        <input type="number" placeholder="Default Quantity" value={newOpening.quantity} onChange={(e) => updateOpening({ quantity: Number(e.target.value) })} />

        <select value={newOpening.wallThicknessOption} onChange={(e) => updateOpening({ wallThicknessOption: e.target.value as WallThicknessOption })}>
          <option value="Half brick">Half brick</option>
          <option value="One brick">One brick</option>
          <option value="Other mm">Other mm</option>
        </select>
        {newOpening.wallThicknessOption === "Other mm" && (
          <input type="number" placeholder="Wall thickness (mm)" value={newOpening.wallThicknessMm || 0} onChange={(e) => updateOpening({ wallThicknessMm: Number(e.target.value) })} />
        )}

        <label><input type="checkbox" checked={newOpening.includeLintel} onChange={(e) => updateOpening({ includeLintel: e.target.checked })} /> Include Lintel</label>
        {newOpening.includeLintel && (
          <input type="number" placeholder="Lintel bearing (mm)" value={newOpening.lintelBearingMm} onChange={(e) => updateOpening({ lintelBearingMm: Number(e.target.value) })} />
        )}
        <label><input type="checkbox" checked={newOpening.includeRevealPlaster} onChange={(e) => updateOpening({ includeRevealPlaster: e.target.checked })} /> Include Reveal Plaster</label>

        {category === "Door" && (
          <>
            <select value={newOpening.doorConfiguration || "Single"} onChange={(e) => updateOpening({ doorConfiguration: e.target.value as DoorConfiguration })}>
              <option value="Single">Single</option><option value="Double">Double</option><option value="Sliding">Sliding</option>
              <option value="Folding">Folding</option><option value="Roller shutter">Roller shutter</option>
            </select>
            <select value={newOpening.doorLeafType || "Hollow core timber door"} onChange={(e) => updateOpening({ doorLeafType: e.target.value as DoorLeafType })}>
              <option value="Hollow core timber door">Hollow core timber door</option>
              <option value="Semi-solid timber door">Semi-solid timber door</option>
              <option value="Solid timber door">Solid timber door</option>
              <option value="Aluminium door">Aluminium door</option>
              <option value="Fire door">Fire door</option>
              <option value="Steel door">Steel door</option>
            </select>
            <select value={newOpening.doorFrameType || "Timber frame"} onChange={(e) => updateOpening({ doorFrameType: e.target.value as DoorFrameType })}>
              <option value="Timber frame">Timber frame</option><option value="Steel frame">Steel frame</option><option value="Aluminium frame">Aluminium frame</option>
            </select>
            <label><input type="checkbox" checked={newOpening.paintDoor || false} onChange={(e) => updateOpening({ paintDoor: e.target.checked })} /> Paint door</label>
            <label><input type="checkbox" checked={newOpening.paintFrame || false} onChange={(e) => updateOpening({ paintFrame: e.target.checked })} /> Paint frame</label>
            <label><input type="checkbox" checked={newOpening.includeIronmongery || false} onChange={(e) => updateOpening({ includeIronmongery: e.target.checked })} /> Include ironmongery</label>
            <label><input type="checkbox" checked={newOpening.includeThreshold || false} onChange={(e) => updateOpening({ includeThreshold: e.target.checked })} /> Include threshold</label>
          </>
        )}

        {category === "Window" && (
          <>
            <select value={newOpening.windowType || "Aluminium window"} onChange={(e) => updateOpening({ windowType: e.target.value as WindowType })}>
              <option value="Aluminium window">Aluminium window</option>
              <option value="Steel window">Steel window</option>
              <option value="Timber window">Timber window</option>
            </select>
            <select value={newOpening.windowFrameType || "Aluminium"} onChange={(e) => updateOpening({ windowFrameType: e.target.value as WindowFrameType })}>
              <option value="Aluminium">Aluminium</option><option value="Steel">Steel</option><option value="Timber">Timber</option>
            </select>
            <label><input type="checkbox" checked={newOpening.externalSill || false} onChange={(e) => updateOpening({ externalSill: e.target.checked })} /> External sill</label>
            <label><input type="checkbox" checked={newOpening.internalSill || false} onChange={(e) => updateOpening({ internalSill: e.target.checked })} /> Internal sill</label>
            <label><input type="checkbox" checked={newOpening.paintFrame || false} onChange={(e) => updateOpening({ paintFrame: e.target.checked })} /> Paint frame</label>
          </>
        )}

        <button onClick={saveOpeningType}>{editingOpeningId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th><th style={thStyle}>Category</th><th style={thStyle}>Width (mm)</th>
            <th style={thStyle}>Height (mm)</th><th style={thStyle}>Qty</th><th style={thStyle}>Lintel</th>
            <th style={thStyle}>Plaster</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {openingTypes.map((op) => (
            <tr key={op.id}>
              <td style={tdStyle}>{op.name}</td>
              <td style={tdStyle}>{op.category}</td>
              <td style={tdStyle}>{op.widthMm}</td>
              <td style={tdStyle}>{op.heightMm}</td>
              <td style={tdStyle}>{op.quantity}</td>
              <td style={tdStyle}>{op.includeLintel ? "Yes" : "No"}</td>
              <td style={tdStyle}>{op.includeRevealPlaster ? "Yes" : "No"}</td>
              <td style={tdStyle}>
                <button onClick={() => editOpeningType(op.id)}>Edit</button>
                <button onClick={() => deleteOpeningType(op.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h2>Opening Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark" value={newOpeningMeas.mark} onChange={(e) => updateOpeningMeas({ mark: e.target.value })} />
        <select value={newOpeningMeas.openingTypeId} onChange={(e) => updateOpeningMeas({ openingTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {openingTypes.map((op) => <option key={op.id} value={op.id}>{op.name} ({op.category})</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={newOpeningMeas.quantity} onChange={(e) => updateOpeningMeas({ quantity: Number(e.target.value) })} />
        <button onClick={saveOpeningMeasurement}>
          {editingOpeningMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingOpeningMeasurementId !== null && (
          <button onClick={() => { setEditingOpeningMeasurementId(null); resetOpeningMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Opening Type</th><th style={thStyle}>Quantity</th><th style={thStyle}>Wall ID (future)</th><th style={thStyle}>Actions</th></tr>
        </thead>
        <tbody>
          {openingMeasurements.map((m) => {
            const op = openingTypes.find((o) => o.id === m.openingTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{op?.name}</td>
                <td style={tdStyle}>{m.quantity}</td>
                <td style={tdStyle}>{m.linkedWallId || "-"}</td>
                <td style={tdStyle}>
                  <button onClick={() => editOpeningMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteOpeningMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OpeningsModule;