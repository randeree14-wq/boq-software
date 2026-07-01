"use client";


import type { WallType, WallMeasurement, BrickType, WallThicknessType, WallFinish, WallLocation, CostPlan } from "@/types/boq";
import { getBrickDefaults, getThicknessFromType } from "@/lib/boqHelpers";
import { useState } from "react";

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
  costPlans: CostPlan[];
}

const WallModule = ({
  wallTypes,
  setWallTypes,
  editingWallId,
  setEditingWallId,
  newWall,
  updateWall = () => {},
  resetWall = () => {},
  wallMeasurements,
  setWallMeasurements,
  newWallMeas,
  updateWallMeas = () => {},
  resetWallMeas = () => {},
  editingWallMeasurementId,
  setEditingWallMeasurementId,
  styles,
  costPlans
}: WallModuleProps) => {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string>("");

  // SAFEGUARD: Create safe versions of all props
  const safeNewWall = {
    name: newWall?.name || "",
    brickType: newWall?.brickType || "Common",
    thicknessType: newWall?.thicknessType || "Single Skin (Half Brick)",
    thicknessMm: newWall?.thicknessMm || 0,
    courseHeight: newWall?.courseHeight || 75,
    side1Plaster: newWall?.side1Plaster ?? true,
    side1Finish: newWall?.side1Finish || "Paint",
    side1TilePcSum: newWall?.side1TilePcSum || 0,
    side2Plaster: newWall?.side2Plaster ?? true,
    side2Finish: newWall?.side2Finish || "Paint",
    side2TilePcSum: newWall?.side2TilePcSum || 0,
    dpcRequired: newWall?.dpcRequired ?? true,
    reinforcementRequired: newWall?.reinforcementRequired ?? false,
    coursesPerReinforcement: newWall?.coursesPerReinforcement || 4,
    reinforcementType: newWall?.reinforcementType || "Galvanised mesh",
  };

  const safeNewWallMeas = {
    mark: newWallMeas?.mark || "",
    wallTypeId: newWallMeas?.wallTypeId || 0,
    length: newWallMeas?.length || 0,
    height: newWallMeas?.height || 0,
    area: newWallMeas?.area || 0,
    wallLocation: newWallMeas?.wallLocation || "Internal Division",
  };

  const safeWallTypes = wallTypes || [];
  const safeWallMeasurements = wallMeasurements || [];

  const handleThicknessTypeChange = (type: WallThicknessType) => {
    const thicknessMm = getThicknessFromType(type);
    updateWall({ thicknessType: type, thicknessMm });
  };

  const handleBrickTypeChange = (type: BrickType) => {
    const { courseHeight } = getBrickDefaults(type);
    updateWall({ brickType: type, courseHeight });
  };

  const saveWallType = () => {
    if (!safeNewWall.name.trim()) return;
    if (editingWallId !== null) {
      setWallTypes((prev) => prev.map((w) => (w.id === editingWallId ? { ...w, ...safeNewWall } : w)));
      setEditingWallId(null);
    } else {
      setWallTypes((prev) => [...prev, { id: Date.now(), ...safeNewWall }]);
    }
    resetWall();
  };

  const editWallType = (id: number) => {
    const wall = safeWallTypes.find((w) => w.id === id);
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
    if (!safeNewWallMeas.mark.trim() || safeNewWallMeas.wallTypeId === 0 || !safeNewWallMeas.length || safeNewWallMeas.length <= 0 || !safeNewWallMeas.height || safeNewWallMeas.height <= 0) return;
    const area = safeNewWallMeas.length * safeNewWallMeas.height;
    const data = {
      ...safeNewWallMeas,
      area,
      wallLocation: safeNewWallMeas.wallLocation || "Internal Division",
      costPlanId: selectedCostPlanId,
    };
    if (editingWallMeasurementId !== null) {
      setWallMeasurements((prev) =>
        prev.map((m) => (m.id === editingWallMeasurementId ? { ...m, ...data } : m))
      );
      setEditingWallMeasurementId(null);
    } else {
      setWallMeasurements((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    resetWallMeas();
  };

  const editWallMeasurement = (id: number) => {
    const measurement = safeWallMeasurements.find((m) => m.id === id);
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

  return (
    <div style={cardStyle}>
      <h1>Wall Module</h1>

      <h2>Wall Type Library</h2>
      <div style={formGridStyle}>
        <input placeholder="Name" value={safeNewWall.name} onChange={(e) => updateWall({ name: e.target.value })} />
        <select value={safeNewWall.brickType} onChange={(e) => handleBrickTypeChange(e.target.value as BrickType)}>
          <option>Common</option><option>Imperial</option><option>Maxi 90</option>
        </select>
        <select value={safeNewWall.thicknessType} onChange={(e) => handleThicknessTypeChange(e.target.value as WallThicknessType)}>
          <option>Single Skin (Half Brick)</option>
          <option>Double Skin (One Brick)</option>
          <option>Cavity Wall</option>
          <option>Triple Skin</option>
        </select>
        <div style={{ padding: "8px", background: "#eef", borderRadius: "4px" }}>Thickness: {safeNewWall.thicknessMm || '-'}mm</div>
        <input type="number" placeholder="Course height (mm) e.g., 75" value={safeNewWall.courseHeight || ''} onChange={(e) => updateWall({ courseHeight: Number(e.target.value) })} />

        <h3 style={{ gridColumn: "1 / -1", margin: "8px 0 4px", fontSize: "16px", fontWeight: "600" }}>Side 1</h3>
        <label><input type="checkbox" checked={safeNewWall.side1Plaster} onChange={(e) => updateWall({ side1Plaster: e.target.checked })} /> Plaster</label>
        <select value={safeNewWall.side1Finish} onChange={(e) => updateWall({ side1Finish: e.target.value as WallFinish })}>
          <option value="None">None</option>
          <option value="Paint">Paint</option>
          <option value="Tile">Tile</option>
        </select>
        {safeNewWall.side1Finish === "Tile" && (
          <input type="number" placeholder="PC sum (R/m²) e.g., 350" value={safeNewWall.side1TilePcSum || ''} onChange={(e) => updateWall({ side1TilePcSum: Number(e.target.value) })} />
        )}

        <h3 style={{ gridColumn: "1 / -1", margin: "8px 0 4px", fontSize: "16px", fontWeight: "600" }}>Side 2</h3>
        <label><input type="checkbox" checked={safeNewWall.side2Plaster} onChange={(e) => updateWall({ side2Plaster: e.target.checked })} /> Plaster</label>
        <select value={safeNewWall.side2Finish} onChange={(e) => updateWall({ side2Finish: e.target.value as WallFinish })}>
          <option value="None">None</option>
          <option value="Paint">Paint</option>
          <option value="Tile">Tile</option>
        </select>
        {safeNewWall.side2Finish === "Tile" && (
          <input type="number" placeholder="PC sum (R/m²) e.g., 350" value={safeNewWall.side2TilePcSum || ''} onChange={(e) => updateWall({ side2TilePcSum: Number(e.target.value) })} />
        )}

        <label><input type="checkbox" checked={safeNewWall.dpcRequired} onChange={(e) => updateWall({ dpcRequired: e.target.checked })} /> DPC required</label>
        <label><input type="checkbox" checked={safeNewWall.reinforcementRequired} onChange={(e) => updateWall({ reinforcementRequired: e.target.checked })} /> Bed joint reinforcement</label>
        {safeNewWall.reinforcementRequired && (
          <input type="number" placeholder="Courses per layer" value={safeNewWall.coursesPerReinforcement || ''} onChange={(e) => updateWall({ coursesPerReinforcement: Number(e.target.value) })} />
        )}
        <button onClick={saveWallType}>{editingWallId !== null ? "Update" : "Save"}</button>
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Brick</th>
          <th style={thStyle}>Thickness</th>
          <th style={thStyle}>Course Ht</th>
          <th style={thStyle}>Side1 Plaster</th>
          <th style={thStyle}>Side1 Finish</th>
          <th style={thStyle}>Side1 PC</th>
          <th style={thStyle}>Side2 Plaster</th>
          <th style={thStyle}>Side2 Finish</th>
          <th style={thStyle}>Side2 PC</th>
          <th style={thStyle}>DPC</th>
          <th style={thStyle}>Reinf</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeWallTypes.map((wall) => (
            <tr key={wall.id}>
              <td style={tdStyle}>{wall.name}</td>
              <td style={tdStyle}>{wall.brickType}</td>
              <td style={tdStyle}>{wall.thicknessMm || '-'}mm</td>
              <td style={tdStyle}>{wall.courseHeight || '-'}</td>
              <td style={tdStyle}>{wall.side1Plaster ? "Yes" : "No"}</td>
              <td style={tdStyle}>{wall.side1Finish || "None"}</td>
              <td style={tdStyle}>{wall.side1Finish === "Tile" ? `R${wall.side1TilePcSum || 0}` : "-"}</td>
              <td style={tdStyle}>{wall.side2Plaster ? "Yes" : "No"}</td>
              <td style={tdStyle}>{wall.side2Finish || "None"}</td>
              <td style={tdStyle}>{wall.side2Finish === "Tile" ? `R${wall.side2TilePcSum || 0}` : "-"}</td>
              <td style={tdStyle}>{wall.dpcRequired ? "Yes" : "No"}</td>
              <td style={tdStyle}>{wall.reinforcementRequired ? `${wall.coursesPerReinforcement || '-'}crs` : "No"}</td>
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
        <input placeholder="Mark (e.g., W1)" value={safeNewWallMeas.mark} onChange={(e) => updateWallMeas({ mark: e.target.value })} />
        <select value={safeNewWallMeas.wallTypeId} onChange={(e) => updateWallMeas({ wallTypeId: Number(e.target.value) })}>
          <option value={0}>Select Type</option>
          {safeWallTypes.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <input type="number" placeholder="Length (m) e.g., 5.5" value={safeNewWallMeas.length || ''} onChange={(e) => updateWallMeas({ length: Number(e.target.value) })} />
        <input type="number" placeholder="Height (m) e.g., 2.7" value={safeNewWallMeas.height || ''} onChange={(e) => updateWallMeas({ height: Number(e.target.value) })} />
        <select
          value={safeNewWallMeas.wallLocation || "Internal Division"}
          onChange={(e) => updateWallMeas({ wallLocation: e.target.value as WallLocation })}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="Internal Division">Internal Division</option>
          <option value="External Envelope">External Envelope</option>
          <option value="Boundary / Retaining Wall">Boundary / Retaining Wall</option>
        </select>
        {/* NEW: Cost Plan dropdown */}
        <select
          value={selectedCostPlanId}
          onChange={(e) => setSelectedCostPlanId(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="">Select Cost Plan</option>
          {costPlans.map(cp => (
            <option key={cp.id} value={cp.id}>{cp.name}</option>
          ))}
        </select>
        <button onClick={saveWallMeasurement}>
          {editingWallMeasurementId !== null ? "Update Measurement" : "Add Measurement"}
        </button>
        {editingWallMeasurementId !== null && (
          <button onClick={() => { setEditingWallMeasurementId(null); resetWallMeas(); }}>Cancel</button>
        )}
      </div>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead><tr>
          <th style={thStyle}>Mark</th>
          <th style={thStyle}>Wall Type</th>
          <th style={thStyle}>Length</th>
          <th style={thStyle}>Height</th>
          <th style={thStyle}>Area (m²)</th>
          <th style={thStyle}>Location</th>
          <th style={thStyle}>Actions</th>
        </tr></thead>
        <tbody>
          {safeWallMeasurements.map((m) => {
            const wall = safeWallTypes.find((w) => w.id === m.wallTypeId);
            return (
              <tr key={m.id}>
                <td style={tdStyle}>{m.mark}</td>
                <td style={tdStyle}>{wall?.name}</td>
                <td style={tdStyle}>{m.length}</td>
                <td style={tdStyle}>{m.height}</td>
                <td style={tdStyle}>{m.area}</td>
                <td style={tdStyle}>{m.wallLocation || "Internal Division"}</td>
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