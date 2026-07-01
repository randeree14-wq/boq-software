"use client";

import { useState } from "react";
import { CostPlan } from "@/types/boq";
import { CostPlanRules } from "@/lib/domain";

interface CostPlanManagerProps {
  costPlans: CostPlan[];
  onAdd: (costPlan: Omit<CostPlan, "id">) => void;
  onEdit: (id: string, costPlan: Omit<CostPlan, "id">) => void;
  onDelete: (id: string) => void;
  styles: any;
}

export default function CostPlanManager({
  costPlans,
  onAdd,
  onEdit,
  onDelete,
  styles,
}: CostPlanManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    grossFloorArea: 0,
    includedInExecutiveSummary: true,
    executiveWeight: 1,
  });

  const [errors, setErrors] = useState<{ name?: string; gfa?: string }>({});

  const resetForm = () => {
    setFormData({
      name: "",
      grossFloorArea: 0,
      includedInExecutiveSummary: true,
      executiveWeight: 1,
    });
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = () => {
    // Validate
    const newErrors: { name?: string; gfa?: string } = {};
    if (!CostPlanRules.validateName(formData.name)) {
      newErrors.name = "Name is required";
    }
    if (!CostPlanRules.validateGFA(formData.grossFloorArea)) {
      newErrors.gfa = "GFA must be 0 or greater";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const now = new Date().toISOString();
    const costPlanData: Omit<CostPlan, "id"> = {
      name: formData.name.trim(),
      grossFloorArea: formData.grossFloorArea,
      includedInExecutiveSummary: formData.includedInExecutiveSummary,
      executiveWeight: formData.executiveWeight,
      version: 1,
      revisionDate: now,
      createdAt: now,
      updatedAt: now,
    };

    if (editingId) {
      // Preserve version and createdAt from existing
      const existing = costPlans.find(cp => cp.id === editingId);
      if (existing) {
        costPlanData.version = existing.version + 1;
        costPlanData.createdAt = existing.createdAt;
      }
      onEdit(editingId, costPlanData);
    } else {
      onAdd(costPlanData);
    }
    resetForm();
  };

  const startEdit = (cp: CostPlan) => {
    setEditingId(cp.id);
    setFormData({
      name: cp.name,
      grossFloorArea: cp.grossFloorArea,
      includedInExecutiveSummary: cp.includedInExecutiveSummary,
      executiveWeight: cp.executiveWeight ?? 1,
    });
    setErrors({});
  };

  const handleDelete = (id: string) => {
    const cp = costPlans.find(p => p.id === id);
    if (!cp) return;
    if (confirm(`Delete Cost Plan "${cp.name}"? This will remove all associated measurements.`)) {
      onDelete(id);
    }
  };

  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};

  return (
    <div style={cardStyle}>
      <h2>Cost Plans</h2>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Cost Plans are the primary grouping layer for measurements. Each measurement must belong to one Cost Plan.
      </p>

      {/* Form */}
      <div style={formGridStyle}>
        <div>
          <input
            placeholder="Cost Plan Name (e.g., Ground Floor Retail)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              padding: "8px",
              border: `1px solid ${errors.name ? "#dc3545" : "#ccc"}`,
              borderRadius: "4px",
              width: "100%",
            }}
          />
          {errors.name && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.name}</span>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Gross Floor Area (m²)"
            value={formData.grossFloorArea || ""}
            onChange={(e) => setFormData({ ...formData, grossFloorArea: Number(e.target.value) || 0 })}
            style={{
              padding: "8px",
              border: `1px solid ${errors.gfa ? "#dc3545" : "#ccc"}`,
              borderRadius: "4px",
              width: "100%",
            }}
          />
          {errors.gfa && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.gfa}</span>}
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.includedInExecutiveSummary}
              onChange={(e) => setFormData({ ...formData, includedInExecutiveSummary: e.target.checked })}
            />
            Include in Executive Summary
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Weight (0-1):</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.executiveWeight}
              onChange={(e) => setFormData({ ...formData, executiveWeight: Number(e.target.value) || 0 })}
              style={{
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "80px",
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 24px",
              backgroundColor: editingId ? "#ffc107" : "#0066cc",
              color: editingId ? "#333" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Update Cost Plan" : "Add Cost Plan"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {costPlans.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic", marginTop: "16px" }}>
          No Cost Plans yet. Add your first Cost Plan above.
        </p>
      ) : (
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>GFA (m²)</th>
              <th style={thStyle}>In Exec</th>
              <th style={thStyle}>Weight</th>
              <th style={thStyle}>Version</th>
              <th style={thStyle}>Updated</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {costPlans.map(cp => (
              <tr key={cp.id}>
                <td style={tdStyle}>{cp.name}</td>
                <td style={tdStyle}>{cp.grossFloorArea}</td>
                <td style={tdStyle}>{cp.includedInExecutiveSummary ? "Yes" : "No"}</td>
                <td style={tdStyle}>{cp.executiveWeight ?? "1.0"}</td>
                <td style={tdStyle}>v{cp.version}</td>
                <td style={tdStyle}>{new Date(cp.updatedAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => startEdit(cp)}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#ffc107",
                      color: "#333",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "4px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cp.id)}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}