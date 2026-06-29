"use client";

import React, { useState, useMemo } from "react";
import { CostPlan, ExecutiveSummaryInputData, SpecialistServiceItem } from "@/types/boq";
import ExecutiveSummary from "./ExecutiveSummary";
import ElementalSummary from "./ElementalSummary";
import DetailedCostPlan from "./DetailedCostPlan";
import SpecialistServicesEditor from "./SpecialistServicesEditor";
import { generateExecutiveSummary, ExecutiveSummaryInput } from "@/lib/executiveSummaryEngine";

interface ReportsTabProps {
  costPlans: CostPlan[];
  executiveInput: ExecutiveSummaryInputData;
  setExecutiveInput: (input: ExecutiveSummaryInputData) => void;
  styles: any;
}

export default function ReportsTab({
  costPlans,
  executiveInput,
  setExecutiveInput,
  styles,
}: ReportsTabProps) {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(2);

  const {
    projectName,
    baseDate,
    buildingArea,
    specialistServices,
    preliminaries,
    preliminariesPercent,
    contingency,
    contingencyPercent,
    escalations,
    professionalFees,
  } = executiveInput;

  // Compute net construction cost (Cost Plans + Specialist Services)
  const netConstructionCost = useMemo(() => {
    const costPlanTotal = costPlans.reduce((sum, cp) => sum + cp.items.reduce((s, item) => s + item.amount, 0), 0);
    const specialistTotal = specialistServices.reduce((sum, s) => sum + s.value, 0);
    return costPlanTotal + specialistTotal;
  }, [costPlans, specialistServices]);

  // Helper to update preliminaries (syncing amount and percentage)
  const updatePreliminaries = (amount?: number, percent?: number) => {
    let newAmount = amount;
    let newPercent = percent;
    if (percent !== undefined && netConstructionCost > 0) {
      newAmount = (netConstructionCost * percent) / 100;
      newPercent = percent;
    } else if (amount !== undefined && netConstructionCost > 0) {
      newPercent = (amount / netConstructionCost) * 100;
      newAmount = amount;
    } else if (amount !== undefined && netConstructionCost === 0) {
      newAmount = amount;
      newPercent = 0;
    }
    updateExecutiveInput({
      preliminaries: newAmount ?? 0,
      preliminariesPercent: newPercent ?? 0,
    });
  };

  // Helper to update contingency (syncing amount and percentage)
  const updateContingency = (amount?: number, percent?: number) => {
    let newAmount = amount;
    let newPercent = percent;
    if (percent !== undefined && netConstructionCost > 0) {
      newAmount = (netConstructionCost * percent) / 100;
      newPercent = percent;
    } else if (amount !== undefined && netConstructionCost > 0) {
      newPercent = (amount / netConstructionCost) * 100;
      newAmount = amount;
    } else if (amount !== undefined && netConstructionCost === 0) {
      newAmount = amount;
      newPercent = 0;
    }
    updateExecutiveInput({
      contingency: newAmount ?? 0,
      contingencyPercent: newPercent ?? 0,
    });
  };

  const updateExecutiveInput = (updates: Partial<ExecutiveSummaryInputData>) => {
    setExecutiveInput({ ...executiveInput, ...updates });
  };

  const executiveEngineInput: ExecutiveSummaryInput = {
    projectName,
    totalGFA: buildingArea,
    baseDate,
    costPlans,
    elementalSummaries: [],
    specialistServices,
    preliminaries,
    contingency,
    escalations,
    professionalFees,
  };

  const executiveSummary = generateExecutiveSummary(executiveEngineInput);

  const tabButtonStyle = (isActive: boolean) => ({
    padding: "10px 20px",
    border: "none",
    backgroundColor: isActive ? "#0066cc" : "transparent",
    color: isActive ? "#ffffff" : "#333333",
    borderRadius: "6px 6px 0 0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "400",
    transition: "all 0.2s",
    borderBottom: isActive ? "3px solid #0066cc" : "3px solid transparent",
    marginBottom: "-2px",
  });

  const tabBarStyle = {
    display: "flex",
    gap: "4px",
    marginBottom: "24px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "0",
    backgroundColor: "#ffffff",
    borderRadius: "8px 8px 0 0",
    padding: "8px 12px 0 12px",
    flexWrap: "wrap" as const,
  };

  return (
    <div>
      <div style={tabBarStyle}>
        <button style={tabButtonStyle(activeLevel === 3)} onClick={() => setActiveLevel(3)}>
          Level 3: Executive Summary
        </button>
        <button style={tabButtonStyle(activeLevel === 2)} onClick={() => setActiveLevel(2)}>
          Level 2: Elemental Summary
        </button>
        <button style={tabButtonStyle(activeLevel === 1)} onClick={() => setActiveLevel(1)}>
          Level 1: Detailed Cost Plan
        </button>
      </div>

      {activeLevel === 3 && (
        <>
          <ExecutiveSummary data={executiveSummary} styles={styles} />

          <SpecialistServicesEditor
            services={specialistServices}
            onServicesChange={(newServices) =>
              updateExecutiveInput({ specialistServices: newServices })
            }
            totalGFA={buildingArea}
            styles={styles}
          />

          <div style={styles.cardStyle}>
            <h3>Preliminaries & Contingencies</h3>
            <div style={styles.formGridStyle}>
              {/* Preliminaries */}
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Preliminaries (%)
                </label>
                <input
                  type="number"
                  value={preliminariesPercent ?? 0}
                  onChange={(e) => {
                    const pct = Number(e.target.value) || 0;
                    updatePreliminaries(undefined, pct);
                  }}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  = R {((netConstructionCost * (preliminariesPercent ?? 0)) / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Preliminaries Amount (R)
                </label>
                <input
                  type="number"
                  value={preliminaries || 0}
                  onChange={(e) => {
                    const amt = Number(e.target.value) || 0;
                    updatePreliminaries(amt, undefined);
                  }}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  = {netConstructionCost > 0 ? ((preliminaries / netConstructionCost) * 100).toFixed(2) : 0}%
                </div>
              </div>

              {/* Contingency */}
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Contingency (%)
                </label>
                <input
                  type="number"
                  value={contingencyPercent ?? 0}
                  onChange={(e) => {
                    const pct = Number(e.target.value) || 0;
                    updateContingency(undefined, pct);
                  }}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  = R {((netConstructionCost * (contingencyPercent ?? 0)) / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Contingency Amount (R)
                </label>
                <input
                  type="number"
                  value={contingency || 0}
                  onChange={(e) => {
                    const amt = Number(e.target.value) || 0;
                    updateContingency(amt, undefined);
                  }}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  = {netConstructionCost > 0 ? ((contingency / netConstructionCost) * 100).toFixed(2) : 0}%
                </div>
              </div>
            </div>

            <div style={{ marginTop: "8px", fontSize: "13px", color: "#555" }}>
              <strong>Net Construction Cost:</strong> R {(netConstructionCost || 0).toFixed(2)}
              <span style={{ marginLeft: "16px" }}>
                (Cost Plans + Specialist Services)
              </span>
            </div>

            <h3 style={{ marginTop: "16px" }}>Escalations</h3>
            {/* ... (unchanged) */}
            <h3 style={{ marginTop: "16px" }}>Professional Fees</h3>
            {/* ... (unchanged) */}
          </div>
        </>
      )}

      {activeLevel === 2 && (
        <ElementalSummary
          costPlans={costPlans}
          totalGFA={buildingArea}
          styles={styles}
          onTotalGFAChange={(value) => updateExecutiveInput({ buildingArea: value })}
        />
      )}

      {activeLevel === 1 && (
        <DetailedCostPlan costPlans={costPlans} styles={styles} />
      )}
    </div>
  );
}