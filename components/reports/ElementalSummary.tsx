"use client";

import React from "react";
import { ElementalSummary as ElementalSummaryType, CostPlan } from "@/types/boq";
import { generateElementalSummary } from "@/lib/elementalSummaryEngine";
import { getCostPlanTotal } from "@/lib/costPlanEngine";

interface ElementalSummaryProps {
  costPlans: CostPlan[];
  totalGFA: number;
  styles: any;
  onTotalGFAChange?: (value: number) => void;
}

export default function ElementalSummary({
  costPlans,
  totalGFA,
  styles,
  onTotalGFAChange,
}: 

ElementalSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Generate Elemental Summaries for each Cost Plan
  const summaries: ElementalSummaryType[] = costPlans.map((cp) =>
    generateElementalSummary(cp)
  );

  const costPlanTotals = costPlans.map((cp) => getCostPlanTotal(cp));
  const totalCostPlanValue = costPlanTotals.reduce((sum, val) => sum + val, 0);

  // Get unique elements across all cost plans
  const allElements = new Map<string, { name: string; code: string; totalValue: number }>();
  
  summaries.forEach((summary) => {
    summary.elements.forEach((element) => {
      if (!allElements.has(element.code)) {
        allElements.set(element.code, {
          name: element.name,
          code: element.code,
          totalValue: 0,
        });
      }
      allElements.get(element.code)!.totalValue += element.value;
    });
  });

  // Sort elements by value (descending)
  const sortedElements = Array.from(allElements.values()).sort(
    (a, b) => b.totalValue - a.totalValue
  );

  // Calculate grand total
  const grandTotal = sortedElements.reduce((sum, el) => sum + el.totalValue, 0);

  // Calculate percentages
  const elementsWithPercentages = sortedElements.map((el) => ({
    ...el,
    percentageOfTotal: grandTotal > 0 ? (el.totalValue / grandTotal) * 100 : 0,
    ratePerM2: totalGFA > 0 ? el.totalValue / totalGFA : 0,
  }));

  // Group by section (using first 3 characters of code as section)
  const sections: Record<string, { name: string; elements: typeof elementsWithPercentages; totalValue: number }> = {};
  
  elementsWithPercentages.forEach((el) => {
    const prefix = el.code.substring(0, 3);
    const sectionMap: Record<string, string> = {
      "SUB": "SUBSTRUCTURE",
      "SS-": "STRUCTURAL FRAME",
      "INT": "INTERNAL DIVISIONS",
      "EXT": "EXTERNAL ENVELOPE",
      "FIN": "FINISHES",
      "SVC": "SERVICES",
      "EXT": "EXTERNAL WORKS", // This will be overridden by the specific case below
    };
    
    // Fix for EXT-W (External Works) vs EXT- (External Envelope)
    let sectionName = sectionMap[prefix] || "OTHER";
    if (el.code.startsWith("EXT-W")) {
      sectionName = "EXTERNAL WORKS";
    } else if (el.code.startsWith("EXT-") && !el.code.startsWith("EXT-W")) {
      sectionName = "EXTERNAL ENVELOPE";
    }
    
    if (!sections[sectionName]) {
      sections[sectionName] = {
        name: sectionName,
        elements: [],
        totalValue: 0,
      };
    }
    sections[sectionName].elements.push(el);
    sections[sectionName].totalValue += el.totalValue;
  });

  // Sort sections by order
  const sectionOrder = [
    "SUBSTRUCTURE",
    "STRUCTURAL FRAME",
    "INTERNAL DIVISIONS",
    "EXTERNAL ENVELOPE",
    "EXTERNAL WORKS",
    "FINISHES",
    "SERVICES",
    "OTHER",
  ];
  
  const sortedSections = Object.keys(sections).sort(
    (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b)
  );

  return (
    <div style={cardStyle}>
      <h2>Elemental Summary</h2>

      {/* Building Area Input */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Building Area (m²):</label>
        <input
          type="number"
          value={totalGFA || ""}
          onChange={(e) => {
            const value = Number(e.target.value) || 0;
            if (onTotalGFAChange) {
              onTotalGFAChange(value);
            }
          }}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "120px",
            fontSize: "14px",
          }}
          step="0.01"
        />
        <span style={{ fontSize: "13px", color: "#666" }}>
          Used to calculate Rate/m²
        </span>
      </div>

      {costPlans.length === 0 ? (
        <p>No cost plans found. Add measurements to generate elemental summary.</p>
      ) : (
        <>
          {/* Cost Plan Totals Row */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
            {costPlans.map((cp, index) => (
              <div
                key={cp.id}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f5f8fa",
                  borderRadius: "6px",
                  border: "1px solid #e0e6ed",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{cp.name}:</span>
                <span style={{ marginLeft: "8px" }}>
                  R {formatCurrency(costPlanTotals[index])}
                </span>
              </div>
            ))}
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#d9e2ec",
                borderRadius: "6px",
                border: "1px solid #b0c4db",
                fontWeight: "bold",
              }}
            >
              Total: R {formatCurrency(totalCostPlanValue)}
            </div>
          </div>

          <table style={tableStyle} border={1} cellPadding={8}>
            <thead>
              <tr>
                <th style={thStyle}>Section / Element</th>
                <th style={thStyle} align="right">Total Cost (R)</th>
                <th style={thStyle} align="right">Rate/m²</th>
                <th style={thStyle} align="right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedSections.map((sectionName) => {
                const section = sections[sectionName];
                const sectionPercentage = grandTotal > 0 ? (section.totalValue / grandTotal) * 100 : 0;

                return (
                  <React.Fragment key={sectionName}>
                    {/* Section Header */}
                    <tr style={{ backgroundColor: "#f0f4f8", fontWeight: "bold" }}>
                      <td style={tdStyle}>{sectionName}</td>
                      <td style={tdStyle} align="right">{formatCurrency(section.totalValue)}</td>
                      <td style={tdStyle} align="right">{formatCurrency(section.totalValue / totalGFA)}</td>
                      <td style={tdStyle} align="right">{sectionPercentage.toFixed(1)}%</td>
                    </tr>

                    {/* Elements */}
                    {section.elements.map((element) => (
                      <tr key={element.code}>
                        <td style={{ ...tdStyle, paddingLeft: "32px" }}>
                          {element.name}
                          <span style={{ fontSize: "11px", color: "#888", marginLeft: "8px" }}>
                            ({element.code})
                          </span>
                        </td>
                        <td style={tdStyle} align="right">{formatCurrency(element.totalValue)}</td>
                        <td style={tdStyle} align="right">{formatCurrency(element.ratePerM2)}</td>
                        <td style={tdStyle} align="right">{element.percentageOfTotal.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}

              {/* Grand Total */}
              <tr style={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#d9e2ec" }}>
                <td style={tdStyle}>ELEMENTAL TOTAL</td>
                <td style={tdStyle} align="right">{formatCurrency(grandTotal)}</td>
                <td style={tdStyle} align="right">{formatCurrency(grandTotal / totalGFA)}</td>
                <td style={tdStyle} align="right">100%</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}