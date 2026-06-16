"use client";

import type { BoqItem } from "@/types/boq";

interface BoqSummaryProps {
  finalBoqItems: Record<string, BoqItem>;
  styles: {
    tableStyle: React.CSSProperties;
    thStyle: React.CSSProperties;
    tdStyle: React.CSSProperties;
  };
}

export default function BoqSummary({ finalBoqItems, styles }: BoqSummaryProps) {
  const { tableStyle, thStyle, tdStyle } = styles;

  return (
    <>
      <h2>Generated BOQ Summary</h2>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>BOQ Item</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(finalBoqItems).map((row) => (
            <tr key={row.item}>
              <td style={tdStyle}>{row.item}</td>
              <td style={tdStyle}>{row.unit}</td>
              <td style={tdStyle}>{row.qty.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}