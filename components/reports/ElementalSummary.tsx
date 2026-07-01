"use client";

import React from "react";
import { ElementalSummary as ElementalSummaryType } from "@/lib/aggregation/costPlanAggregator";

interface ElementalSummaryProps {
  summary: ElementalSummaryType;
  styles: any;
}

export default function ElementalSummary({ summary, styles }: ElementalSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={cardStyle}>
      <h2>Elemental Summary: {summary.costPlanName}</h2>
      <p>GFA: {summary.grossFloorArea} m² | Total Value: {formatCurrency(summary.totalValue)}</p>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Element</th>
            <th style={thStyle}>Total (R)</th>
            <th style={thStyle}>Rate/m²</th>
            <th style={thStyle}>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {summary.elements.map(el => (
            <tr key={el.elementId}>
              <td>{el.elementName}</td>
              <td>{formatCurrency(el.total)}</td>
              <td>{formatCurrency(el.ratePerM2)}</td>
              <td>{el.percentageOfTotal.toFixed(1)}%</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", backgroundColor: "#d9e2ec" }}>
            <td>TOTAL</td>
            <td>{formatCurrency(summary.totalValue)}</td>
            <td></td>
            <td>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}