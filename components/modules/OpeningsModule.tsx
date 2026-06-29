"use client";

import type { OpeningType, OpeningMeasurement } from "@/types/boq";

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

export default function OpeningsModule({
  openingTypes,
  setOpeningTypes,
  editingOpeningId,
  setEditingOpeningId,
  newOpening,
  updateOpening = () => {},
  resetOpening = () => {},
  openingMeasurements,
  setOpeningMeasurements,
  newOpeningMeas,
  updateOpeningMeas = () => {},
  resetOpeningMeas = () => {},
  editingOpeningMeasurementId,
  setEditingOpeningMeasurementId,
  styles,
}: OpeningsModuleProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};

  // SAFEGUARD: Safe versions of all props
  const safeNewOpening = {
    name: newOpening?.name || "",
    category: newOpening?.category || "Door",
    widthMm: newOpening?.widthMm || 0,
    heightMm: newOpening?.heightMm || 0,
    quantity: newOpening?.quantity || 0,
    wallThicknessOption: newOpening?.wallThicknessOption || "Half brick",
    wallThicknessMm: newOpening?.wallThicknessMm || 0,
    includeLintel: newOpening?.includeLintel ?? true,
    lintelBearingMm: newOpening?.lintelBearingMm || 230,
    includeRevealPlaster: newOpening?.includeRevealPlaster ?? true,
    doorConfiguration: newOpening?.doorConfiguration || "Single",
    doorLeafType: newOpening?.doorLeafType || "Hollow core timber door",
    doorFrameType: newOpening?.doorFrameType || "Timber frame",
    paintDoor: newOpening?.paintDoor ?? false,
    paintFrame: newOpening?.paintFrame ?? false,
    includeIronmongery: newOpening?.includeIronmongery ?? false,
    includeThreshold: newOpening?.includeThreshold ?? false,
    windowType: newOpening?.windowType || "Aluminium window",
    windowFrameType: newOpening?.windowFrameType || "Aluminium",
    externalSill: newOpening?.externalSill ?? false,
    internalSill: newOpening?.internalSill ?? false,
  };

  const safeNewOpeningMeas = {
    mark: newOpeningMeas?.mark || "",
    openingTypeId: newOpeningMeas?.openingTypeId || 0,
    quantity: newOpeningMeas?.quantity || 0,
    linkedWallId: newOpeningMeas?.linkedWallId || 0,
  };

  const safeOpeningTypes = openingTypes || [];
  const safeOpeningMeasurements = openingMeasurements || [];

  const saveOpeningType = () => {
    if (!safeNewOpening.name.trim()) return;
    if (editingOpeningId !== null) {
      setOpeningTypes((prev) =>
        prev.map((o) => (o.id === editingOpeningId ? { ...o, ...safeNewOpening } : o))
      );
      setEditingOpeningId(null);
    } else {
      setOpeningTypes((prev) => [...prev, { id: Date.now(), ...safeNewOpening }]);
    }
    resetOpening();
  };

  const editOpeningType = (id: number) => {
    const opening = safeOpeningTypes.find((o) => o.id === id);
    if (opening) {
      updateOpening(opening);
      setEditingOpeningId(id);
    }
  };

  const deleteOpeningType = (id: number) => {
    setOpeningTypes((prev) => prev.filter((o) => o.id !== id));
    setOpeningMeasurements((prev) => prev.filter((m) => m.openingTypeId !== id));
  };

  const addOpeningMeasurement = () => {
    if (!safeNewOpeningMeas.mark.trim() || safeNewOpeningMeas.openingTypeId === 0 || !safeNewOpeningMeas.quantity || safeNewOpeningMeas.quantity <= 0) return;
    const measurement = {
      id: Date.now(),
      ...safeNewOpeningMeas,
      elementalSectionId: "Internal Divisions",
      elementalElementId: "Openings",
    };
    if (editingOpeningMeasurementId !== null) {
      setOpeningMeasurements((prev) =>
        prev.map((m) => (m.id === editingOpeningMeasurementId ? { ...m, ...measurement } : m))
      );
      setEditingOpeningMeasurementId(null);
    } else {
      setOpeningMeasurements((prev) => [...prev, measurement]);
    }
    resetOpeningMeas();
  };

  const editOpeningMeasurement = (id: number) => {
    const measurement = safeOpeningMeasurements.find((m) => m.id === id);
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

  return (
    <div style={cardStyle}>
      <h2>Opening Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewOpening.name} onChange={(e) => updateOpening({ name: e.target.value })} />
        <select value={safeNewOpening.category} onChange={(e) => updateOpening({ category: e.target.value as "Door" | "Window" })}>
          <option>Door</option><option>Window</option>
        </select>
        <input type="number" placeholder="Width (mm)" value={safeNewOpening.widthMm || ''} onChange={(e) => updateOpening({ widthMm: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Height (mm)" value={safeNewOpening.heightMm || ''} onChange={(e) => updateOpening({ heightMm: Number(e.target.value) || 0 })} />
        <input type="number" placeholder="Quantity" value={safeNewOpening.quantity || ''} onChange={(e) => updateOpening({ quantity: Number(e.target.value) || 0 })} />
        <select value={safeNewOpening.wallThicknessOption} onChange={(e) => updateOpening({ wallThicknessOption: e.target.value as "Half brick" | "One brick" | "Other mm" })}>
          <option>Half brick</option><option>One brick</option><option>Other mm</option>
        </select>
        {safeNewOpening.wallThicknessOption === "Other mm" && (
          <input type="number" placeholder="Wall thickness (mm)" value={safeNewOpening.wallThicknessMm || ''} onChange={(e) => updateOpening({ wallThicknessMm: Number(e.target.value) || 0 })} />
        )}
        <label><input type="checkbox" checked={safeNewOpening.includeLintel} onChange={(e) => updateOpening({ includeLintel: e.target.checked })} /> Include lintel</label>
        {safeNewOpening.includeLintel && (
          <input type="number" placeholder="Lintel bearing (mm)" value={safeNewOpening.lintelBearingMm || ''} onChange={(e) => updateOpening({ lintelBearingMm: Number(e.target.value) || 0 })} />
        )}
        <label><input type="checkbox" checked={safeNewOpening.includeRevealPlaster} onChange={(e) => updateOpening({ includeRevealPlaster: e.target.checked })} /> Reveal plaster</label>

        {safeNewOpening.category === "Door" && (
          <>
            <select value={safeNewOpening.doorConfiguration} onChange={(e) => updateOpening({ doorConfiguration: e.target.value as "Single" | "Double" | "Sliding" | "Folding" | "Roller shutter" })}>
              <option>Single</option><option>Double</option><option>Sliding</option><option>Folding</option><option>Roller shutter</option>
            </select>
            <select value={safeNewOpening.doorLeafType} onChange={(e) => updateOpening({ doorLeafType: e.target.value as "Hollow core timber door" | "Semi-solid timber door" | "Solid timber door" | "Aluminium door" | "Fire door" | "Steel door" })}>
              <option>Hollow core timber door</option><option>Semi-solid timber door</option><option>Solid timber door</option>
              <option>Aluminium door</option><option>Fire door</option><option>Steel door</option>
            </select>
            <select value={safeNewOpening.doorFrameType} onChange={(e) => updateOpening({ doorFrameType: e.target.value as "Timber frame" | "Steel frame" | "Aluminium frame" })}>
              <option>Timber frame</option><option>Steel frame</option><option>Aluminium frame</option>
            </select>
            <label><input type="checkbox" checked={safeNewOpening.paintDoor} onChange={(e) => updateOpening({ paintDoor: e.target.checked })} /> Paint door</label>
            <label><input type="checkbox" checked={safeNewOpening.paintFrame} onChange={(e) => updateOpening({ paintFrame: e.target.checked })} /> Paint frame</label>
            <label><input type="checkbox" checked={safeNewOpening.includeIronmongery} onChange={(e) => updateOpening({ includeIronmongery: e.target.checked })} /> Ironmongery</label>
            <label><input type="checkbox" checked={safeNewOpening.includeThreshold} onChange={(e) => updateOpening({ includeThreshold: e.target.checked })} /> Threshold</label>
          </>
        )}

        {safeNewOpening.category === "Window" && (
          <>
            <select value={safeNewOpening.windowType} onChange={(e) => updateOpening({ windowType: e.target.value as "Aluminium window" | "Steel window" | "Timber window" })}>
              <option>Aluminium window</option><option>Steel window</option><option>Timber window</option>
            </select>
            <select value={safeNewOpening.windowFrameType} onChange={(e) => updateOpening({ windowFrameType: e.target.value as "Aluminium" | "Steel" | "Timber" })}>
              <option>Aluminium</option><option>Steel</option><option>Timber</option>
            </select>
            <label><input type="checkbox" checked={safeNewOpening.externalSill} onChange={(e) => updateOpening({ externalSill: e.target.checked })} /> External sill</label>
            <label><input type="checkbox" checked={safeNewOpening.internalSill} onChange={(e) => updateOpening({ internalSill: e.target.checked })} /> Internal sill</label>
            <label><input type="checkbox" checked={safeNewOpening.paintFrame} onChange={(e) => updateOpening({ paintFrame: e.target.checked })} /> Paint frame</label>
          </>
        )}

        <button onClick={saveOpeningType}>{editingOpeningId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th><th style={thStyle}>Category</th>
          <th style={thStyle}>W</th><th style={thStyle}>H</th>
          <th style={thStyle}>Qty</th><th style={thStyle}>Wall Thk</th>
          <th style={thStyle}>Lintel</th><th style={thStyle}>Reveal</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeOpeningTypes.map((op) => (
            <tr key={op.id}>
              <td style={tdStyle}>{op.name}</td>
              <td style={tdStyle}>{op.category}</td>
              <td style={tdStyle}>{op.widthMm || 0}mm</td>
              <td style={tdStyle}>{op.heightMm || 0}mm</td>
              <td style={tdStyle}>{op.quantity || 0}</td>
              <td style={tdStyle}>{op.wallThicknessOption}</td>
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
        <input placeholder="Mark (e.g., D1)" value={safeNewOpeningMeas.mark} onChange={(e) => updateOpeningMeas({ mark: e.target.value })} />
        <select value={safeNewOpeningMeas.openingTypeId} onChange={(e) => updateOpeningMeas({ openingTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeOpeningTypes.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={safeNewOpeningMeas.quantity || ''} onChange={(e) => updateOpeningMeas({ quantity: Number(e.target.value) || 0 })} />
        <button onClick={addOpeningMeasurement}>
          {editingOpeningMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingOpeningMeasurementId !== null && (
          <button onClick={() => { setEditingOpeningMeasurementId(null); resetOpeningMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th><th style={thStyle}>Type</th><th style={thStyle}>Quantity</th><th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeOpeningMeasurements.map((m) => {
            const op = safeOpeningTypes.find((o) => o.id === m.openingTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{op?.name}</td>
                <td style={tdStyle}>{m.quantity}</td>
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
}