"use client";

import React, { useState, useMemo } from "react";
import { CostPlan, ComputedMeasurementItem, Element } from "@/types/boq";
import {
  getElementalSummaryForCostPlan,
  getProjectElementalSummary,
  getExecutiveSummary,
  ExecutiveSummary as ExecutiveSummaryType,
} from "@/lib/aggregation";

import ExecutiveSummary from "./ExecutiveSummary";
import ElementalSummary from "./ElementalSummary";
import DetailedCostPlan from "./DetailedCostPlan";
import SpecialistServicesEditor from "./SpecialistServicesEditor";

interface ReportsTabProps {
  costPlans: CostPlan[];
  computedItems: ComputedMeasurementItem[] | undefined;
  elements: Element[];
  specialistServices?: any[];
  preliminaries?: number;
  preliminariesPercent?: number;
  contingency?: number;
  contingencyPercent?: number;
  escalations?: any;
  professionalFees?: any;
  onUpdateExecutiveInput?: (updates: any) => void;
  styles: any;
}

export default function ReportsTab({
  costPlans,
  computedItems,
  elements,
  specialistServices = [],
  preliminaries = 0,
  preliminariesPercent = 0,
  contingency = 0,
  contingencyPercent = 0,
  escalations = { preConstructionMonths: 0, preConstructionRate: 0, constructionMonths: 0, constructionRate: 0 },
  professionalFees = { coreConsultants: 0, specialistConsultants: 0, disbursements: 0 },
  onUpdateExecutiveInput = () => {},
  styles,
}: ReportsTabProps) {
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(2);

  // Compute summaries
  const selectedSummary = useMemo(() => {
    if (selectedCostPlanId) {
      return getElementalSummaryForCostPlan(
        selectedCostPlanId,
        costPlans,
        computedItems,
        elements
      );
    }
    return null;
  }, [selectedCostPlanId, costPlans, computedItems, elements]);

  const projectSummary = useMemo(() => {
    return getProjectElementalSummary(
      costPlans,
      computedItems,
      elements
    );
  }, [costPlans, computedItems, elements]);

  // Net construction cost (for percentage calculations)
  const netConstructionCost = useMemo(() => {
    const safeItems = computedItems || [];
    const total = safeItems.reduce((sum, item) => sum + item.amount, 0);
    return total;
  }, [computedItems]);

  // Escalation amount (with fallbacks)
  const escalationAmount = useMemo(() => {
    const {
      preConstructionMonths = 0,
      preConstructionRate = 0,
      constructionMonths = 0,
      constructionRate = 0,
    } = escalations || {};
    const preEsc = netConstructionCost * (preConstructionRate / 100) * (preConstructionMonths / 12);
    const constEsc = netConstructionCost * (constructionRate / 100) * (constructionMonths / 12);
    return preEsc + constEsc;
  }, [netConstructionCost, escalations]);

  // Professional fees total (with fallbacks)
  const professionalFeesTotal = useMemo(() => {
    const { coreConsultants = 0, specialistConsultants = 0, disbursements = 0 } = professionalFees || {};
    return coreConsultants + specialistConsultants + disbursements;
  }, [professionalFees]);

  // Executive summary (using the computed escalation and fees)
  const executiveSummary = useMemo(() => {
    return getExecutiveSummary(
      costPlans,
      computedItems,
      specialistServices,
      preliminaries,
      contingency,
      escalationAmount,
      professionalFeesTotal
    );
  }, [costPlans, computedItems, specialistServices, preliminaries, contingency, escalationAmount, professionalFeesTotal]);

  const activeSummary = selectedCostPlanId ? selectedSummary : projectSummary;

  const filteredItems = useMemo(() => {
    const safeItems = computedItems || [];
    if (selectedCostPlanId) {
      return safeItems.filter(item => item.costPlanId === selectedCostPlanId);
    }
    return safeItems;
  }, [computedItems, selectedCostPlanId]);

  // Tab styles
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

  // Helper functions for preliminaries and contingency sync
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
    onUpdateExecutiveInput({
      preliminaries: newAmount ?? 0,
      preliminariesPercent: newPercent ?? 0,
    });
  };

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
    onUpdateExecutiveInput({
      contingency: newAmount ?? 0,
      contingencyPercent: newPercent ?? 0,
    });
  };

  return (
    <div>
      {/* Cost Plan Selector */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <label style={{ fontWeight: "bold" }}>Cost Plan:</label>
        <select
          value={selectedCostPlanId || ""}
          onChange={(e) => setSelectedCostPlanId(e.target.value || null)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minWidth: "200px" }}
        >
          <option value="">All Cost Plans (Project View)</option>
          {costPlans.map(cp => (
            <option key={cp.id} value={cp.id}>{cp.name}</option>
          ))}
        </select>
      </div>

      {/* Level Navigation */}
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

      {/* Level 1 */}
      {activeLevel === 1 && (
        <DetailedCostPlan
          items={filteredItems}
          costPlans={costPlans}
          selectedCostPlanId={selectedCostPlanId}
          elements={elements}
          styles={styles}
        />
      )}

      {/* Level 2 */}
      {activeLevel === 2 && activeSummary && (
        <ElementalSummary summary={activeSummary} styles={styles} />
      )}

      {/* Level 3 */}
      {activeLevel === 3 && (
        <>
          <ExecutiveSummary data={executiveSummary} styles={styles} />

          {/* Specialist Services */}
          <SpecialistServicesEditor
            services={specialistServices}
            onServicesChange={(newServices) =>
              onUpdateExecutiveInput({ specialistServices: newServices })
            }
            totalGFA={0}
            styles={styles}
          />

          {/* Preliminaries & Contingency */}
          <div style={styles.cardStyle}>
            <h3>Preliminaries & Contingencies</h3>
            <div style={styles.formGridStyle}>
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
              <span style={{ marginLeft: "16px" }}>(Cost Plans + Specialist Services)</span>
            </div>
          </div>

          {/* Escalations */}
          <div style={styles.cardStyle}>
            <h3>Escalations</h3>
            <div style={styles.formGridStyle}>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Pre-Construction (months)
                </label>
                <input
                  type="number"
                  value={escalations.preConstructionMonths || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      escalations: {
                        ...escalations,
                        preConstructionMonths: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.5"
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Pre-Construction Rate (%)
                </label>
                <input
                  type="number"
                  value={escalations.preConstructionRate || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      escalations: {
                        ...escalations,
                        preConstructionRate: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Construction (months)
                </label>
                <input
                  type="number"
                  value={escalations.constructionMonths || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      escalations: {
                        ...escalations,
                        constructionMonths: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.5"
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Construction Rate (%)
                </label>
                <input
                  type="number"
                  value={escalations.constructionRate || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      escalations: {
                        ...escalations,
                        constructionRate: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Professional Fees */}
          <div style={styles.cardStyle}>
            <h3>Professional Fees</h3>
            <div style={styles.formGridStyle}>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Core Consultants (R)
                </label>
                <input
                  type="number"
                  value={professionalFees.coreConsultants || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      professionalFees: {
                        ...professionalFees,
                        coreConsultants: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Specialist Consultants (R)
                </label>
                <input
                  type="number"
                  value={professionalFees.specialistConsultants || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      professionalFees: {
                        ...professionalFees,
                        specialistConsultants: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  Disbursements (R)
                </label>
                <input
                  type="number"
                  value={professionalFees.disbursements || 0}
                  onChange={(e) =>
                    onUpdateExecutiveInput({
                      professionalFees: {
                        ...professionalFees,
                        disbursements: Number(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}