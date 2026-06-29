"use client";

import React from "react";
import { ExecutiveSummary as ExecutiveSummaryType } from "@/types/boq";
import { getCostPlanTotal } from "@/lib/costPlanEngine";

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryType;
  styles: any;
}

export default function ExecutiveSummary({ data, styles }: ExecutiveSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div style={cardStyle}>
      <h2>Executive Summary</h2>
      
      {/* Project Info */}
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Project:</strong> {data.projectName}</p>
        <p><strong>Base Date:</strong> {data.baseDate}</p>
        <p><strong>Total GFA:</strong> {data.totalGFA.toFixed(2)} m²</p>
      </div>

      {/* Cost Plan Roll-up */}
      <h3>1. Cost Plan Roll-up</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Cost Plan / Scope</th>
            <th style={thStyle}>Value (R)</th>
            <th style={thStyle}>Rate/m² (R)</th>
            <th style={thStyle}>% of Total Project</th>
          </tr>
        </thead>
        <tbody>
          {data.costPlanLines.map((line) => (
            <tr key={line.name}>
              <td style={tdStyle}>{line.name}</td>
              <td style={tdStyle}>{formatCurrency(line.value)}</td>
              <td style={tdStyle}>{formatCurrency(line.projectRatePerM2)}</td>
              <td style={tdStyle}>{line.percentageOfTotalProject.toFixed(1)}%</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td style={tdStyle}>Cost Plan Total</td>
            <td style={tdStyle}>{formatCurrency(data.costPlanTotal)}</td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
          </tr>
        </tbody>
      </table>

      {/* Specialist Services */}
      <h3 style={{ marginTop: "20px" }}>2. Specialist Services</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Item</th>
            <th style={thStyle}>Value (R)</th>
            <th style={thStyle}>Rate/m² (R)</th>
            <th style={thStyle}>% of Project</th>
          </tr>
        </thead>
        <tbody>
          {data.specialistServices.items.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.category}</td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{formatCurrency(item.value)}</td>
              <td style={tdStyle}>{formatCurrency(item.ratePerM2)}</td>
              <td style={tdStyle}>{item.percentageOfProject.toFixed(1)}%</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td style={tdStyle} colSpan={2}>Specialist Services Total</td>
            <td style={tdStyle}>{formatCurrency(data.specialistServices.totalValue)}</td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
          </tr>
        </tbody>
      </table>

      {/* Construction Cost Build-up */}
      <h3 style={{ marginTop: "20px" }}>3. Construction Cost Build-up</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <tbody>
          <tr>
            <td style={tdStyle}>Cost Plan Total</td>
            <td style={tdStyle}>{formatCurrency(data.costPlanTotal)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Specialist Services</td>
            <td style={tdStyle}>{formatCurrency(data.specialistServices.totalValue)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Preliminaries</td>
            <td style={tdStyle}>{formatCurrency(data.preliminaries)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Contingency</td>
            <td style={tdStyle}>{formatCurrency(data.contingency)}</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td style={tdStyle}>Estimated Current Construction Cost (as at base date)</td>
            <td style={tdStyle}>{formatCurrency(data.estimatedCurrentConstructionCost)}</td>
          </tr>
        </tbody>
      </table>

      {/* Escalations */}
      <h3 style={{ marginTop: "20px" }}>4. Escalations</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <tbody>
          <tr>
            <td style={tdStyle}>Pre-Construction Period</td>
            <td style={tdStyle}>{data.escalations.preConstructionMonths} months @ {data.escalations.preConstructionRate}%</td>
          </tr>
          <tr>
            <td style={tdStyle}>Construction Period</td>
            <td style={tdStyle}>{data.escalations.constructionMonths} months @ {data.escalations.constructionRate}%</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td style={tdStyle}>Estimated Construction Cost at Completion (Excl Fees & VAT)</td>
            <td style={tdStyle}>{formatCurrency(data.estimatedConstructionCostAtCompletion)}</td>
          </tr>
        </tbody>
      </table>

      {/* Professional Fees */}
      <h3 style={{ marginTop: "20px" }}>5. Professional Fees</h3>
      <table style={tableStyle} border={1} cellPadding={8}>
        <tbody>
          <tr>
            <td style={tdStyle}>Core Consultants</td>
            <td style={tdStyle}>{formatCurrency(data.professionalFees.coreConsultants)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Specialist Consultants</td>
            <td style={tdStyle}>{formatCurrency(data.professionalFees.specialistConsultants)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Disbursements</td>
            <td style={tdStyle}>{formatCurrency(data.professionalFees.disbursements)}</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td style={tdStyle}>Total Professional Fees</td>
            <td style={tdStyle}>{formatCurrency(data.professionalFees.total)}</td>
          </tr>
        </tbody>
      </table>

      {/* Final Output */}
      <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#d9e2ec", borderRadius: "6px" }}>
        <h3 style={{ margin: "0", fontSize: "18px" }}>
          Estimated Development Cost at Completion (Excl VAT)
        </h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", margin: "8px 0 0 0" }}>
          R {formatCurrency(data.estimatedDevelopmentCostAtCompletion)}
        </p>
      </div>
    </div>
  );
}