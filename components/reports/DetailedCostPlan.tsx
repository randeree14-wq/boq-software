"use client";

import React from "react";
import { CostPlan, CostPlanItem } from "@/types/boq";
import { getCostPlanBreakdown, getCostPlanTotal } from "@/lib/costPlanEngine";
import { ELEMENT_NAMES } from "@/lib/elementalSummaryEngine";

interface DetailedCostPlanProps {
  costPlans: CostPlan[];
  styles: any;
  onCostPlanChange?: (costPlanId: string, items: CostPlanItem[]) => void;
}

export default function DetailedCostPlan({
  costPlans,
  styles,
  onCostPlanChange,
}: DetailedCostPlanProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (value: number) => {
    return value.toFixed(3);
  };

  if (!costPlans || costPlans.length === 0) {
    return (
      <div style={cardStyle}>
        <h2>Detailed Cost Plan</h2>
        <p>No cost plans found. Add measurements to generate cost plans.</p>
      </div>
    );
  }

  // Group items by element code
  const groupByElement = (items: CostPlanItem[]): Record<string, CostPlanItem[]> => {
    const grouped: Record<string, CostPlanItem[]> = {};
    items.forEach((item) => {
      const key = item.elementCode;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    return grouped;
  };

  // Sort elements by order (using predefined order from ELEMENT_CODES if available)
  const getElementOrder = (code: string): number => {
    const orderMap: Record<string, number> = {
      "SUB-01": 1,
      "SUB-02": 2,
      "SUB-03": 3,
      "SUB-04": 4,
      "SUB-05": 5,
      "SS-01": 6,
      "SS-02": 7,
      "SS-03": 8,
      "SS-04": 9,
      "INT-01": 10,
      "INT-02": 11,
      "INT-03": 12,
      "EXT-01": 13,
      "EXT-02": 14,
      "EXT-03": 15,
      "EXT-04": 16,
      "FIN-01": 17,
      "FIN-02": 18,
      "FIN-03": 19,
      "FIN-04": 20,
      "FIN-05": 21,
      "SVC-01": 22,
      "SVC-02": 23,
      "SVC-03": 24,
      "SVC-04": 25,
      "EXT-W-01": 26,
      "PRE-01": 27,
    };
    return orderMap[code] || 999;
  };

  return (
    <div style={cardStyle}>
      <h2>Detailed Cost Plan</h2>

      {costPlans.map((costPlan) => {
        const total = getCostPlanTotal(costPlan);
        const breakdown = getCostPlanBreakdown(costPlan);
        const groupedItems = groupByElement(costPlan.items);

        // Sort element codes by predefined order
        const sortedElementCodes = Object.keys(groupedItems).sort(
          (a, b) => getElementOrder(a) - getElementOrder(b)
        );

        return (
          <div key={costPlan.id} style={{ marginBottom: "40px" }}>
            <h3 style={{ marginBottom: "12px" }}>
              {costPlan.name}
              {costPlan.multiplier && costPlan.multiplier > 1 && (
                <span style={{ fontSize: "14px", fontWeight: "normal", color: "#666", marginLeft: "8px" }}>
                  (Multiplier: {costPlan.multiplier}x)
                </span>
              )}
              <span style={{ fontSize: "14px", fontWeight: "normal", color: "#666", marginLeft: "16px" }}>
                GFA: {costPlan.gfa_m2.toFixed(2)} m²
              </span>
              <span style={{ fontSize: "14px", fontWeight: "normal", color: "#666", marginLeft: "16px" }}>
                Rate/m²: R {formatCurrency(total / costPlan.gfa_m2)}
              </span>
            </h3>

            <table style={tableStyle} border={1} cellPadding={8}>
              <thead>
                <tr>
                  <th style={thStyle} width="30%">Element / Item</th>
                  <th style={thStyle} width="12%">Unit</th>
                  <th style={thStyle} width="15%">Qty</th>
                  <th style={thStyle} width="15%">Rate (R)</th>
                  <th style={thStyle} width="15%">Amount (R)</th>
                </tr>
              </thead>
              <tbody>
                {sortedElementCodes.map((elementCode) => {
                  const items = groupedItems[elementCode];
                  const elementName = ELEMENT_NAMES[elementCode] || elementCode;
                  const elementTotal = items.reduce((sum, item) => sum + item.amount, 0);
                  const elementPercentage = total > 0 ? (elementTotal / total) * 100 : 0;

                  return (
                    <React.Fragment key={elementCode}>
                      {/* Element Header */}
                      <tr style={{ backgroundColor: "#f0f4f8", fontWeight: "bold" }}>
                        <td style={tdStyle}>
                          {elementName}
                          <span style={{ fontSize: "12px", fontWeight: "normal", color: "#666", marginLeft: "8px" }}>
                            ({elementCode})
                          </span>
                        </td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                      </tr>

                      {/* Individual Items */}
                      {items.map((item, index) => (
                        <tr key={`${costPlan.id}-${item.id}`}>
                          <td style={{ ...tdStyle, paddingLeft: "32px" }}>
                            {item.description}
                          </td>
                          <td style={tdStyle}>{item.unit}</td>
                          <td style={tdStyle}>
                            <input
                              type="number"
                              value={item.quantity || ""}
                              onChange={(e) => {
                                const newQty = Number(e.target.value) || 0;
                                if (onCostPlanChange) {
                                  const updatedItems = costPlan.items.map((i) => {
                                    if (i.id === item.id) {
                                      const newAmount = newQty * item.rate;
                                      return { ...i, quantity: newQty, amount: newAmount };
                                    }
                                    return i;
                                  });
                                  onCostPlanChange(costPlan.id, updatedItems);
                                }
                              }}
                              style={{ width: "80px", padding: "4px", textAlign: "right" }}
                              step="0.001"
                            />
                          </td>
                          <td style={tdStyle}>
                            <input
                              type="number"
                              value={item.rate || ""}
                              onChange={(e) => {
                                const newRate = Number(e.target.value) || 0;
                                if (onCostPlanChange) {
                                  const updatedItems = costPlan.items.map((i) => {
                                    if (i.id === item.id) {
                                      const newAmount = i.quantity * newRate;
                                      return { ...i, rate: newRate, amount: newAmount };
                                    }
                                    return i;
                                  });
                                  onCostPlanChange(costPlan.id, updatedItems);
                                }
                              }}
                              style={{ width: "80px", padding: "4px", textAlign: "right" }}
                              step="0.01"
                            />
                          </td>
                          <td style={tdStyle}>{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}

                      {/* Element Subtotal */}
                      <tr style={{ fontWeight: "bold", backgroundColor: "#e8edf2" }}>
                        <td style={{ ...tdStyle, fontStyle: "italic", paddingLeft: "32px" }}>
                          Element Subtotal
                        </td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}>
                          {formatCurrency(elementTotal)}
                          <span style={{ fontSize: "11px", fontWeight: "normal", color: "#666", marginLeft: "8px" }}>
                            ({elementPercentage.toFixed(1)}%)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5} style={{ padding: "2px" }} />
                      </tr>
                    </React.Fragment>
                  );
                })}

                {/* Cost Plan Total */}
                <tr style={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#d9e2ec" }}>
                  <td style={tdStyle} colSpan={4}>
                    TOTAL — {costPlan.name}
                  </td>
                  <td style={tdStyle}>{formatCurrency(total)}</td>
                </tr>
                <tr style={{ backgroundColor: "#f5f8fa" }}>
                  <td style={{ ...tdStyle, fontSize: "13px", color: "#555" }} colSpan={5}>
                    Rate per m²: <strong>R {formatCurrency(total / costPlan.gfa_m2)}</strong>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    GFA: {costPlan.gfa_m2.toFixed(2)} m²
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}