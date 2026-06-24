"use client";

import type { BoqItem } from "@/types/boq";
import { getActiveElements } from "@/lib/elementalStructure";

interface DashboardProps {
  boqItems: Record<string, BoqItem>;
  styles: {
    cardStyle: React.CSSProperties;
  };
}

export default function Dashboard({ boqItems, styles }: DashboardProps) {
  const { cardStyle } = styles;
  const totalItems = Object.keys(boqItems).length;
  const totalQuantity = Object.values(boqItems).reduce((sum, item) => sum + item.qty, 0);
  const activeElements = getActiveElements();

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ ...cardStyle, padding: "16px" }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#666" }}>Total BOQ Items</h3>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>{totalItems}</p>
        </div>
        <div style={{ ...cardStyle, padding: "16px" }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#666" }}>Total Quantity</h3>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>{totalQuantity.toFixed(2)}</p>
        </div>
        <div style={{ ...cardStyle, padding: "16px" }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#666" }}>Active Elements</h3>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>{activeElements.length}</p>
        </div>
      </div>

      {/* Active Elements List */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 12px 0" }}>Active Measurement Elements</h3>
        <ul style={{ margin: "0", padding: "0", listStyle: "none" }}>
          {activeElements.map((el) => (
            <li key={el.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span style={{ fontWeight: "500" }}>{el.name}</span>
              {el.description && <span style={{ color: "#666", marginLeft: "8px" }}>– {el.description}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}