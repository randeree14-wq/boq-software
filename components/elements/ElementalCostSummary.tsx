"use client";

import React from "react";
import type { CostPlanComponent } from "@/types/boq";
import { elementalStructure, getElementById } from "@/lib/elementalStructure";

interface ElementalCostSummaryProps {
  costPlanComponents: CostPlanComponent[];
  styles: {
    cardStyle: React.CSSProperties;
    tableStyle: React.CSSProperties;
    thStyle: React.CSSProperties;
    tdStyle: React.CSSProperties;
  };
  rates?: Record<string, number>;
}

export default function ElementalCostSummary({
  costPlanComponents,
  styles,
  rates = {},
}: ElementalCostSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles;

  // Helper: get rate for a component
  const getRate = (component: CostPlanComponent): number => {
    for (const [key, rate] of Object.entries(rates)) {
      if (key.includes(component.description) || component.description.includes(key)) {
        return rate;
      }
    }
    return component.rate || 0;
  };

  // Group by element
  const elements: Record<
    string,
    {
      sectionId: string;
      sectionName: string;
      elementId: string;
      elementName: string;
      totalQty: number;
      totalCost: number;
      components: CostPlanComponent[];
    }
  > = {};

  let totalProjectCost = 0;

  // If no components, show message
  if (!costPlanComponents || costPlanComponents.length === 0) {
    return (
      <div style={cardStyle}>
        <h2>Elemental Cost Summary</h2>
        <p>No cost plan components found.</p>
        <p style={{ color: "#999", marginTop: "8px" }}>
          To generate components:
          <br />
          1. Go to Elemental Measurement tab
          <br />
          2. Add a wall type with finishes (Paint or Tile)
          <br />
          3. Add a wall measurement with a location
          <br />
          4. The components will appear here automatically
        </p>
        <div style={{ marginTop: "16px", padding: "12px", background: "#f5f5f5", borderRadius: "4px" }}>
          <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
            <strong>Debug:</strong> Received {costPlanComponents?.length || 0} components
          </p>
        </div>
      </div>
    );
  }

  // Process each component
  costPlanComponents.forEach((component) => {
    const sectionId = component.elementalSectionId || "uncategorised";
    const elementId = component.elementalElementId || "uncategorised";
    const rate = getRate(component);
    const amount = (component.qty || 0) * rate;
    const key = `${sectionId}|${elementId}`;

    if (!elements[key]) {
      const section = elementalStructure.find((s) => s.id === sectionId);
      const sectionName = section?.name || sectionId;
      const element = getElementById(elementId);
      const elementName = element?.name || elementId;
      elements[key] = {
        sectionId,
        sectionName,
        elementId,
        elementName,
        totalQty: 0,
        totalCost: 0,
        components: [],
      };
    }
    elements[key].totalQty += component.qty || 0;
    elements[key].totalCost += amount;
    elements[key].components.push({ ...component, rate, amount });
    totalProjectCost += amount;
  });

  // Group by section
  const sections: Record<string, { sectionName: string; elements: any[] }> = {};
  Object.values(elements).forEach((el) => {
    if (!sections[el.sectionId]) {
      sections[el.sectionId] = {
        sectionName: el.sectionName,
        elements: [],
      };
    }
    sections[el.sectionId].elements.push(el);
  });

  const sortedSectionIds = Object.keys(sections).sort();

  // Group components for the "View All Components" table
  const grouped = costPlanComponents.reduce((acc, comp) => {
    const key = comp.id;
    if (!acc[key]) {
      acc[key] = { ...comp };
    }
    return acc;
  }, {} as Record<string, CostPlanComponent>);

  // If totalProjectCost is 0, show message
  if (totalProjectCost === 0) {
    return (
      <div style={cardStyle}>
        <h2>Elemental Cost Summary</h2>
        <p>No cost data available. Add rates to BOQ items in the Detailed BOQ tab.</p>
        <p style={{ color: "#999", marginTop: "8px" }}>
          Cost components found: {costPlanComponents.length}
        </p>
        <div style={{ marginTop: "16px", padding: "12px", background: "#f5f5f5", borderRadius: "4px" }}>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>View components</summary>
            <pre style={{ fontSize: "12px", overflow: "auto", maxHeight: "200px" }}>
              {JSON.stringify(costPlanComponents, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return (value || 0).toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div style={cardStyle}>
      <h2>Elemental Cost Summary</h2>
      
      <div style={{ padding: "8px 12px", background: "#f0f8ff", borderRadius: "4px", marginBottom: "16px" }}>
        <p style={{ margin: "4px 0", fontSize: "13px", color: "#0066cc" }}>
          <strong>Debug:</strong> {costPlanComponents.length} components | 
          {Object.keys(elements).length} elements | 
          Total cost: R {formatCurrency(totalProjectCost)}
        </p>
      </div>

      <p style={{ color: "#666", marginBottom: "16px" }}>
        Project costs grouped by AAQS elemental sections and elements.
        Percentages are based on total project cost.
        <span style={{ marginLeft: "16px", fontWeight: "bold" }}>
          Total Project Cost: R {formatCurrency(totalProjectCost)}
        </span>
        <span style={{ marginLeft: "16px", fontSize: "12px", color: "#999" }}>
          ({costPlanComponents.length} components)
        </span>
      </p>

      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Section / Element</th>
            <th style={thStyle}>Total Quantity</th>
            <th style={thStyle}>Total Cost (R)</th>
            <th style={thStyle}>% of Project</th>
          </tr>
        </thead>
        <tbody>
          {sortedSectionIds.map((sectionId) => {
            const section = sections[sectionId];
            const elements = section.elements.sort((a, b) => b.totalCost - a.totalCost);
            let sectionTotalCost = 0;
            let sectionTotalQty = 0;

            return (
              <React.Fragment key={sectionId}>
                <tr style={{ backgroundColor: "#f0f4f8", fontWeight: "bold" }}>
                  <td style={tdStyle} colSpan={4}>
                    {section.sectionName}
                  </td>
                </tr>
                {elements.map((element) => {
                  sectionTotalCost += element.totalCost || 0;
                  sectionTotalQty += element.totalQty || 0;
                  const percentage = totalProjectCost > 0 ? ((element.totalCost || 0) / totalProjectCost) * 100 : 0;
                  return (
                    <tr key={`${element.sectionId}|${element.elementId}`}>
                      <td style={{ ...tdStyle, paddingLeft: "24px" }}>{element.elementName}</td>
                      <td style={tdStyle}>{((element.totalQty || 0)).toFixed(3)}</td>
                      <td style={tdStyle}>{formatCurrency(element.totalCost || 0)}</td>
                      <td style={tdStyle}>{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: "bold", backgroundColor: "#e8edf2" }}>
                  <td style={{ ...tdStyle, fontStyle: "italic" }}>Section Subtotal</td>
                  <td style={tdStyle}>{((sectionTotalQty || 0)).toFixed(3)}</td>
                  <td style={tdStyle}>{formatCurrency(sectionTotalCost || 0)}</td>
                  <td style={tdStyle}>
                    {totalProjectCost > 0 ? ((sectionTotalCost || 0) / totalProjectCost * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ padding: "4px" }} />
                </tr>
              </React.Fragment>
            );
          })}
          <tr style={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#d9e2ec" }}>
            <td style={tdStyle}>PROJECT TOTAL</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>{formatCurrency(totalProjectCost)}</td>
            <td style={tdStyle}>100%</td>
          </tr>
        </tbody>
      </table>

      <details style={{ marginTop: "24px" }}>
        <summary style={{ cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
          View All Components ({costPlanComponents.length})
        </summary>
        <table style={{ ...tableStyle, marginTop: "12px" }} border={1} cellPadding={6}>
          <thead>
            <tr>
              <th style={thStyle}>Module</th>
              <th style={thStyle}>Mark</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Rate (R)</th>
              <th style={thStyle}>Amount (R)</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(grouped).map((comp) => {
              const rate = getRate(comp);
              const amount = (comp.qty || 0) * rate;
              return (
                <tr key={comp.id}>
                  <td style={tdStyle}>{comp.module}</td>
                  <td style={tdStyle}>{comp.mark}</td>
                  <td style={tdStyle}>{comp.description}</td>
                  <td style={tdStyle}>{comp.unit}</td>
                  <td style={tdStyle}>{((comp.qty || 0)).toFixed(3)}</td>
                  <td style={tdStyle}>{(rate || 0).toFixed(2)}</td>
                  <td style={tdStyle}>{(amount || 0).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </div>
  );
}