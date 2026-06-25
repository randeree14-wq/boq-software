"use client";

import { useState } from "react";
import type { CostPlanComponent } from "@/types/boq";

export default function TestPage() {
  const [components, setComponents] = useState<CostPlanComponent[]>([
    {
      id: "test-1",
      measurementId: 123,
      mark: "W1",
      module: "Walls",
      elementalSectionId: "internal-divisions",
      elementalElementId: "walls",
      description: "Common brickwork - Single Skin (Half Brick)",
      unit: "m²",
      qty: 24,
      rate: 350,
      amount: 8400,
    },
    {
      id: "test-2",
      measurementId: 123,
      mark: "W1",
      module: "Walls",
      elementalSectionId: "internal-wall-finishes",
      elementalElementId: "wall-finishes",
      description: "Plaster & Paint - side 1",
      unit: "m²",
      qty: 24,
      rate: 120,
      amount: 2880,
    },
    {
      id: "test-3",
      measurementId: 123,
      mark: "W1",
      module: "Walls",
      elementalSectionId: "internal-wall-finishes",
      elementalElementId: "wall-finishes",
      description: "Plaster & Tiling - side 2",
      unit: "m²",
      qty: 24,
      rate: 450,
      amount: 10800,
    },
  ]);

  const styles = {
    cardStyle: { border: "1px solid #ddd", borderRadius: "12px", padding: "20px", marginTop: "25px", backgroundColor: "#ffffff" },
    tableStyle: { width: "100%", borderCollapse: "collapse" as const, marginTop: "10px", backgroundColor: "#ffffff" },
    thStyle: { padding: "8px 12px", textAlign: "left" as const },
    tdStyle: { padding: "8px 12px" },
  };

  // Try the ElementalCostSummary with test data
  const ElementalCostSummary = require("@/components/elements/ElementalCostSummary").default;

  return (
    <main style={{ padding: "30px", fontFamily: "Arial", maxWidth: "1600px", margin: "0 auto" }}>
      <h1>Test Page - Elemental Cost Summary</h1>
      <p>Testing with {components.length} components</p>

      <ElementalCostSummary
        costPlanComponents={components}
        styles={styles}
        rates={{}}
      />

      {/* Display the raw components */}
      <div style={{ marginTop: "40px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h3>Raw Components ({components.length})</h3>
        <pre style={{ background: "#f5f5f5", padding: "12px", borderRadius: "4px", overflow: "auto" }}>
          {JSON.stringify(components, null, 2)}
        </pre>
      </div>
    </main>
  );
}