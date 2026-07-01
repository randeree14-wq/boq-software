"use client";

import React from "react";
import { ExecutiveSummary as ExecutiveSummaryType } from "@/types/boq";

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryType;
  styles: any;
}

export default function ExecutiveSummary({ data, styles }: ExecutiveSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};

  const formatCurrency = (value: number | undefined | null) => {
    const safeValue = value ?? 0;
    return safeValue.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Guard against undefined data
  if (!data) {
    return (
      <div style={cardStyle}>
        <p>No executive summary data available.</p>
      </div>
    );
  }

  // Ensure all data fields have defaults
  const {
    includedCostPlans = [],
    totalBuildingWorks = 0,
    specialistServices = 0,
    preliminaries = 0,
    contingency = 0,
    escalation = 0,
    professionalFees = 0,
    finalTotal = 0,
  } = data;

  return (
    <div style={cardStyle}>
      <h2>Executive Summary</h2>

      {/* Cost Plan Roll-up */}
      <h3>1. Cost Plan Roll-up</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Cost Plan / Scope</th>
            <th style={thStyle}>Value (R)</th>
            <th style={thStyle}>Weight</th>
            <th style={thStyle}>Contribution (R)</th>
          </tr>
        </thead>
        <tbody>
          {includedCostPlans.length === 0 ? (
            <tr>
              <td style={tdStyle} colSpan={4}>No Cost Plans included in Executive Summary.</td>
            </tr>
          ) : (
            includedCostPlans.map((line, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{line.name}</td>
                <td style={tdStyle}>{formatCurrency(line.amount)}</td>
                <td style={tdStyle}>{line.weight}</td>
                <td style={tdStyle}>{formatCurrency(line.contribution)}</td>
              </tr>
            ))
          )}
          <tr style={{ fontWeight: "bold" }}>
            <td style={tdStyle}>Total Building Works</td>
            <td style={tdStyle}>{formatCurrency(totalBuildingWorks)}</td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
          </tr>
        </tbody>
      </table>

      {/* Additional Layers */}
      <h3 style={{ marginTop: "20px" }}>2. Additional Layers</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <tbody>
          <tr>
            <td style={tdStyle}>Specialist Services</td>
            <td style={tdStyle}>{formatCurrency(specialistServices)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Preliminaries</td>
            <td style={tdStyle}>{formatCurrency(preliminaries)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Contingency</td>
            <td style={tdStyle}>{formatCurrency(contingency)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Escalation</td>
            <td style={tdStyle}>{formatCurrency(escalation)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Professional Fees</td>
            <td style={tdStyle}>{formatCurrency(professionalFees)}</td>
          </tr>
          <tr style={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#d9e2ec" }}>
            <td style={tdStyle}>FINAL TOTAL</td>
            <td style={tdStyle}>{formatCurrency(finalTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}