"use client";

import React from "react";
import { ComputedMeasurementItem, CostPlan, Element } from "@/types/boq";

interface DetailedCostPlanProps {
  items: ComputedMeasurementItem[];
  costPlans: CostPlan[];
  selectedCostPlanId: string | null;
  elements: Element[];
  styles: any;
}

export default function DetailedCostPlan({
  items,
  costPlans,
  selectedCostPlanId,
  elements,
  styles,
}: DetailedCostPlanProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Group items by element
  const grouped = items.reduce((acc, item) => {
    const key = item.elementId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ComputedMeasurementItem[]>);

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  // Get the cost plan name if selected
  const costPlanName = selectedCostPlanId
    ? costPlans.find(cp => cp.id === selectedCostPlanId)?.name
    : "All Cost Plans";

  return (
    <div style={cardStyle}>
      <h2>Detailed Cost Plan: {costPlanName || "All"}</h2>
      <p>Total Items: {items.length} | Total Value: {formatCurrency(total)}</p>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Element</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Rate</th>
            <th style={thStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([elementId, elementItems]) => {
            const element = elements.find(e => e.id === elementId);
            const elementTotal = elementItems.reduce((sum, item) => sum + item.amount, 0);
            return (
              <React.Fragment key={elementId}>
                <tr style={{ backgroundColor: "#f0f4f8", fontWeight: "bold" }}>
                  <td colSpan={6}>{element?.name || elementId}</td>
                </tr>
                {elementItems.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ paddingLeft: "24px" }}></td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{formatCurrency(item.rate)}</td>
                    <td>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", backgroundColor: "#e8edf2" }}>
                  <td colSpan={5} style={{ textAlign: "right" }}>Element Total</td>
                  <td>{formatCurrency(elementTotal)}</td>
                </tr>
                <tr><td colSpan={6} style={{ padding: "4px" }} /></tr>
              </React.Fragment>
            );
          })}
          <tr style={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#d9e2ec" }}>
            <td colSpan={5} style={{ textAlign: "right" }}>GRAND TOTAL</td>
            <td>{formatCurrency(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}