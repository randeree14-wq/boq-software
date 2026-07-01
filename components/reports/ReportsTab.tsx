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

interface ReportsTabProps {
  costPlans: CostPlan[];
  computedItems: ComputedMeasurementItem[] | undefined;
  elements: Element[];
  specialistServices: any[] | undefined;  // Changed to optional
  preliminaries: number;
  contingency: number;
  escalationAmount: number;
  professionalFees: number;
  styles: any;
}

export default function ReportsTab({
  costPlans,
  computedItems,
  elements,
  specialistServices = [],
  preliminaries,
  contingency,
  escalationAmount,
  professionalFees,
  styles,
}: ReportsTabProps) {
  const [selectedCostPlanId, setSelectedCostPlanId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(2);

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

  const executiveSummary = useMemo(() => {
    return getExecutiveSummary(
      costPlans,
      computedItems,
      specialistServices,
      preliminaries,
      contingency,
      escalationAmount,
      professionalFees
    );
  }, [costPlans, computedItems, specialistServices, preliminaries, contingency, escalationAmount, professionalFees]);

  const activeSummary = selectedCostPlanId ? selectedSummary : projectSummary;

  const filteredItems = useMemo(() => {
    const safeItems = computedItems || [];
    if (selectedCostPlanId) {
      return safeItems.filter(item => item.costPlanId === selectedCostPlanId);
    }
    return safeItems;
  }, [computedItems, selectedCostPlanId]);

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
        <ExecutiveSummary data={executiveSummary} styles={styles} />
      )}

      {activeLevel === 2 && activeSummary && (
        <ElementalSummary summary={activeSummary} styles={styles} />
      )}

      {activeLevel === 1 && (
        <DetailedCostPlan
          items={filteredItems}
          costPlans={costPlans}
          selectedCostPlanId={selectedCostPlanId}
          elements={elements}
          styles={styles}
        />
      )}
    </div>
  );
}