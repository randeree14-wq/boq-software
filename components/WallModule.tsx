"use client";

import type { WallType, WallMeasurement, BrickType, WallThicknessType } from "@/types/boq";
import { getBrickDefaults, getThicknessFromType } from "@/lib/boqHelpers";

interface WallModuleProps {
  wallTypes: WallType[];
  setWallTypes: React.Dispatch<React.SetStateAction<WallType[]>>;
  editingWallId: number | null;
  setEditingWallId: React.Dispatch<React.SetStateAction<number | null>>;
  newWall: Omit<WallType, "id">;
  updateWall: (partial: Partial<Omit<WallType, "id">>) => void;
  resetWall: () => void;
  wallMeasurements: WallMeasurement[];
  setWallMeasurements: React.Dispatch<React.SetStateAction<WallMeasurement[]>>;
  newWallMeas: Omit<WallMeasurement, "id">;
  updateWallMeas: (partial: Partial<Omit<WallMeasurement, "id">>) => void;
  resetWallMeas: () => void;
  editingWallMeasurementId: number | null;
  setEditingWallMeasurementId: React.Dispatch<React.SetStateAction<number | null>>;
  styles: any;
}

const WallModule = ({
  wallTypes,
  setWallTypes,
  editingWallId,
  setEditingWallId,
  newWall,
  updateWall,
  resetWall,
  wallMeasurements,
  setWallMeasurements,
  newWallMeas,
  updateWallMeas,
  resetWallMeas,
  editingWallMeasurementId,
  setEditingWallMeasurementId,
  styles,
}: WallModuleProps) => {
  const handleThicknessTypeChange = (type: WallThicknessType) => {
    const thicknessMm = getThicknessFromType(type);
    updateWall({ thicknessType: type, thicknessMm });
  };

  const handleBrickTypeChange = (type: BrickType) => {
    const { courseHeight } = getBrickDefaults(type);
    updateWall({ brickType: type, courseHeight });
  };

  const saveWallType = () => {
    if (!newWall.name.trim()) return;
    if (editingWallId !== null) {
      setWallTypes((prev) => prev.map((w) => (w.id === editingWallId ? { ...w, ...newWall } : w)));
      setEditingWallId(null);
    } else {
      setWallTypes((prev) => [...prev, { id: Date.now(), ...newWall }]);
    }
    resetWall();
  };

  const editWallType = (id: number) => {
    const wall = wallTypes.find((w) => w.id === id);
    if (wall) {
      updateWall(wall);
      setEditingWallId(id);
    }
  };

  const deleteWallType = (id: number) => {
    setWallTypes((prev) => prev.filter((w) => w.id !== id));
    setWallMeasurements((prev) => prev.filter((m) => m.wallTypeId !== id));
  };

  const saveWallMeasurement = () => {
    if (!newWallMeas.mark.trim() || newWallMeas.wallTypeId === 0 || newWallMeas.length <= 0 || newWallMeas.height <= 0) return;
    
    const area = newWallMeas.length * newWallMeas.height;
    const measurementData = { ...newWallMeas, area };
    
    if (editingWallMeasurementId !== null) {
      setWallMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingWallMeasurementId ? { ...m, ...measurementData } : m
        )
      );
      setEditingWallMeasurementId(null);
    } else {
      setWallMeasurements((prev) => [...prev, { id: Date.now(), ...measurementData }]);
    }
    resetWallMeas();
  };

  const editWallMeasurement = (id: number) => {
    const measurement = wallMeasurements.find((m) => m.id === id);
    if (measurement) {
      updateWallMeas(measurement);
      setEditingWallMeasurementId(id);
    }
  };

  const deleteWallMeasurement = (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
      setWallMeasurements((prev) => prev.filter((m) => m.id !== id));
      if (editingWallMeasurementId === id) {
        setEditingWallMeasurementId(null);
        resetWallMeas();
      }
    }
  };

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;

  return (
    <div style={cardStyle}>
      <h1>Wall Module</h1>
      <h2>Wall Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={newWall.name} onChange={(e) => updateWall({ name: e.target.value })} />
        <select value={newWall.brickType} onChange={(e) => handleBrickTypeChange(e.target.value as BrickType)}>
          <option>Common</option><option>Imperial</option><option>Maxi 90</option>
        </select>
        <select value={newWall.thicknessType} onChange={(e) => handleThicknessTypeChange(e.target.value as WallThicknessType)}>
          <option>Single Skin (Half Brick)</option><option>Double Skin (One Brick)</option><option>Cavity Wall</option><option>Triple Skin</option>
        </select>
        <div style={{ padding: "8px", background: "#eef", borderRadius: "4px" }}>Thickness: {newWall.thicknessMm}mm</div>
        <label><input type="checkbox" checked={newWall.plasterBothSides} onChange={(e) => updateWall({ plasterBothSides: e.target.checked })} /> Plaster both sides</label>
        <label><input type="checkbox" checked={newWall.paintRequired} onChange={(e) => updateWall({ paintRequired: e.target.checked })} /> Paint required</label>
        <label><input type="checkbox" checked={newWall.dpcRequired} onChange={(e) => updateWall({ dpcRequired: e.target.checked })} /> DPC required</label>
        <label><input type="checkbox" checked={newWall.reinforcementRequired} onChange={(e) => updateWall({ reinforcementRequired: e.target.checked })} /> Bed joint reinforcement</label>
        {newWall.reinforcementRequired && (
          <input type="number" placeholder="Courses per layer" value={newWall.coursesPerReinforcement} onChange={(e) => updateWall({ coursesPerReinforcement: Number(e.target.value) })} />
        )}
        <label><input type="checkbox" checked={newWall.tilesInternal} onChange={(e) => updateWall({ tilesInternal: e.target.checked })} /> Tiles internal</label>
        {newWall.tilesInternal && (
          <input type="number" placeholder="PC sum internal (R/m²)" value={newWall.tilePcSumInternal} onChange={(e) => updateWall({ tilePcSumInternal: Number(e.target.value) })} />
        )}
        <label><input type="checkbox" checked={newWall.tilesExternal} onChange={(e) => updateWall({ tilesExternal: e.target.checked })} /> Tiles external</label>
        {newWall.tilesExternal && (
          <input type="number" placeholder="PC sum external (R/m²)" value={newWall.tilePcSumExternal} onChange={(e) => updateWall({ tilePcSumExternal: Number(e.target.value) })} />
        )}
        <button onClick={saveWallType}>{editingWallId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th><th style={thStyle}>Brick Type</th><th style={thStyle}>Wall Type</th>
            <th style={thStyle}>Thick</th><th style={thStyle}>Plaster</th><th style={thStyle}>Paint</th>
            <th style={thStyle}>DPC</th><th style={thStyle}>Reinf</th><th style={thStyle}>Int Tiles</th>
            <th style={thStyle}>Ext Tiles</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wallTypes.map((wall) => (
            <tr key={wall.id}>
              <td style={tdStyle}>{wall.name}</td>
              <td style={tdStyle}>{wall.brickType}</td>
              <td style={tdStyle}>{wall.thicknessType}</td>
              <td style={tdStyle}>{wall.thicknessMm}mm</td>
              <td style={tdStyle}>{wall.plasterBothSides ? "Both" : "No"}</td>
              <td style={tdStyle}>{wall.paintRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{wall.dpcRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{wall.reinforcementRequired ? `${wall.coursesPerReinforcement}crs` : "No"}</td>
              <td style={tdStyle}>{wall.tilesInternal ? `R${wall.tilePcSumInternal}` : "No"}</td>
              <td style={tdStyle}>{wall.tilesExternal ? `R${wall.tilePcSumExternal}` : "No"}</td>
              <td style={tdStyle}>
                <button onClick={() => editWallType(wall.id)}>Edit</button>
                <button onClick={() => deleteWallType(wall.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h2>Wall Measurements</h2>
      <div style={formGridStyle}>
        <input placeholder="Mark" value={newWallMeas.mark} onChange={(e) => updateWallMeas({ mark: e.target.value })} />
        <select value={newWallMeas.wallTypeId} onChange={(e) => updateWallMeas({ wallTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {wallTypes.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m)" value={newWallMeas.length} onChange={(e) => updateWallMeas({ length: Number(e.target.value) })} />
        <input type="number" placeholder="Height (m)" value={newWallMeas.height} onChange={(e) => updateWallMeas({ height: Number(e.target.value) })} />
        <button onClick={saveWallMeasurement}>
          {editingWallMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingWallMeasurementId !== null && (
          <button onClick={() => { setEditingWallMeasurementId(null); resetWallMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr><th style={thStyle}>Mark</th><th style={thStyle}>Wall Type</th><th style={thStyle}>Length</th><th style={thStyle}>Height</th><th style={thStyle}>Area (m²)</th><th style={thStyle}>Actions</th></tr>
        </thead>
        <tbody>
          {wallMeasurements.map((m) => {
            const wall = wallTypes.find((w) => w.id === m.wallTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{wall?.name}</td>
                <td style={tdStyle}>{m.length}</td>
                <td style={tdStyle}>{m.height}</td>
                <td style={tdStyle}>{m.area}</td>
                <td style={tdStyle}>
                  <button onClick={() => editWallMeasurement(m.id)}>Edit</button>
                  <button onClick={() => deleteWallMeasurement(m.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WallModule;