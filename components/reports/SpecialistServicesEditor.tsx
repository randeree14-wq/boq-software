"use client";

import React, { useState } from "react";
import { SpecialistServiceItem, SpecialistCategory, SPECIALIST_CATEGORIES } from "@/types/boq";

interface SpecialistServicesEditorProps {
  services: SpecialistServiceItem[];
  onServicesChange: (services: SpecialistServiceItem[]) => void;
  totalGFA: number;
  styles: any;
}

export default function SpecialistServicesEditor({
  services,
  onServicesChange,
  totalGFA,
  styles,
}: SpecialistServicesEditorProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle, formGridStyle } = styles || {};

  const [newService, setNewService] = useState<Partial<SpecialistServiceItem>>({
    category: "OTHER",
    name: "",
    description: "",
    value: 0,
    ratePerM2: 0,
    lumpSum: 0,
    unit: "lump",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAddService = () => {
    if (!newService.name?.trim()) {
      alert("Please enter a service name.");
      return;
    }

    const isRateBased = newService.unit === "m²";
    const rate = isRateBased ? (newService.ratePerM2 || 0) : 0;
    const lump = isRateBased ? 0 : (newService.lumpSum || 0);
    const value = isRateBased ? rate * totalGFA : lump;

    const service: SpecialistServiceItem = {
      id: `svc-${Date.now()}`,
      category: newService.category || "OTHER",
      name: newService.name || "",
      description: newService.description || "",
      value: value,
      ratePerM2: rate,
      lumpSum: lump,
      unit: newService.unit || "lump",
      percentageOfProject: 0,
    };

    onServicesChange([...services, service]);
    setNewService({
      category: "OTHER",
      name: "",
      description: "",
      value: 0,
      ratePerM2: 0,
      lumpSum: 0,
      unit: "lump",
    });
  };

  const handleRemoveService = (id: string) => {
    if (confirm("Are you sure you want to remove this specialist service?")) {
      onServicesChange(services.filter((s) => s.id !== id));
    }
  };

  const handleEditService = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setNewService({
        category: service.category,
        name: service.name,
        description: service.description,
        value: service.value,
        ratePerM2: service.ratePerM2,
        lumpSum: service.lumpSum,
        unit: service.unit,
      });
      setEditingId(id);
    }
  };

  const handleUpdateService = () => {
    if (!newService.name?.trim() || !editingId) {
      alert("Please enter a service name.");
      return;
    }

    const isRateBased = newService.unit === "m²";
    const rate = isRateBased ? (newService.ratePerM2 || 0) : 0;
    const lump = isRateBased ? 0 : (newService.lumpSum || 0);
    const value = isRateBased ? rate * totalGFA : lump;

    const updatedServices = services.map((s) =>
      s.id === editingId
        ? {
            ...s,
            category: newService.category || "OTHER",
            name: newService.name || "",
            description: newService.description || "",
            value: value,
            ratePerM2: rate,
            lumpSum: lump,
            unit: newService.unit || "lump",
          }
        : s
    );

    onServicesChange(updatedServices);
    setNewService({
      category: "OTHER",
      name: "",
      description: "",
      value: 0,
      ratePerM2: 0,
      lumpSum: 0,
      unit: "lump",
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setNewService({
      category: "OTHER",
      name: "",
      description: "",
      value: 0,
      ratePerM2: 0,
      lumpSum: 0,
      unit: "lump",
    });
    setEditingId(null);
  };

  return (
    <div style={cardStyle}>
      <h3>Specialist Services</h3>

      {/* Add/Edit Form */}
      <div style={{ ...formGridStyle, marginBottom: "16px" }}>
        <select
          value={newService.category || "OTHER"}
          onChange={(e) =>
            setNewService({ ...newService, category: e.target.value as SpecialistCategory })
          }
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          {Object.entries(SPECIALIST_CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Service Name (e.g., Standby Generator)"
          value={newService.name || ""}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={newService.description || ""}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <select
          value={newService.unit || "lump"}
          onChange={(e) =>
            setNewService({
              ...newService,
              unit: e.target.value as "m²" | "lump",
            })
          }
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="lump">Lump Sum</option>
          <option value="m²">Rate per m²</option>
        </select>

        {newService.unit === "m²" ? (
          <input
            type="number"
            placeholder="Rate per m² (R)"
            value={newService.ratePerM2 || ""}
            onChange={(e) =>
              setNewService({
                ...newService,
                ratePerM2: Number(e.target.value) || 0,
                lumpSum: 0,
              })
            }
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        ) : (
          <input
            type="number"
            placeholder="Lump Sum (R)"
            value={newService.lumpSum || ""}
            onChange={(e) =>
              setNewService({
                ...newService,
                lumpSum: Number(e.target.value) || 0,
                ratePerM2: 0,
              })
            }
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          {editingId ? (
            <>
              <button
                onClick={handleUpdateService}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
              <button
                onClick={handleCancelEdit}
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
            </>
          ) : (
            <button
              onClick={handleAddService}
              style={{
                padding: "8px 16px",
                backgroundColor: "#0066cc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Service
            </button>
          )}
        </div>
      </div>

      {/* Service List */}
      {services.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic" }}>
          No specialist services added. Add services above.
        </p>
      ) : (
        <table style={tableStyle} border={1} cellPadding={8}>
          <thead>
            <tr>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Rate/Lump</th>
              <th style={thStyle}>Total Value (R)</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td style={tdStyle}>{SPECIALIST_CATEGORIES[service.category as SpecialistCategory] || service.category}</td>
                <td style={tdStyle}>{service.name}</td>
                <td style={tdStyle}>{service.description || "-"}</td>
                <td style={tdStyle}>{service.unit === "m²" ? "Rate/m²" : "Lump Sum"}</td>
                <td style={tdStyle}>
                  {service.unit === "m²"
                    ? `R ${formatCurrency(service.ratePerM2)} / m²`
                    : `R ${formatCurrency(service.lumpSum)}`}
                </td>
                <td style={tdStyle}>{formatCurrency(service.value)}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEditService(service.id)}
                    style={{
                      padding: "4px 8px",
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
                    onClick={() => handleRemoveService(service.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
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