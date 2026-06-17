"use client";

import type { BoqItem } from "@/types/boq";

interface BoqSummaryProps {
  boqItems: Record<string, BoqItem>;
  styles: {
    tableStyle: React.CSSProperties;
    thStyle: React.CSSProperties;
    tdStyle: React.CSSProperties;
  };
}

export default function BoqSummary({ boqItems, styles }: BoqSummaryProps) {
  const { tableStyle, thStyle, tdStyle } = styles;

  // If no items, show message
  if (!boqItems || Object.keys(boqItems).length === 0) {
    return <p>No BOQ items generated yet. Add measurements to see the summary.</p>;
  }

  // Group items by billNo → section
  const bills: Record<string, { billName: string; sections: Record<string, BoqItem[]> }> = {};

  Object.values(boqItems).forEach((item) => {
    const billKey = item.billNo;
    if (!bills[billKey]) {
      bills[billKey] = { billName: item.billName, sections: {} };
    }
    const sectionKey = item.section;
    if (!bills[billKey].sections[sectionKey]) {
      bills[billKey].sections[sectionKey] = [];
    }
    bills[billKey].sections[sectionKey].push(item);
  });

  // Get sorted list of active bills (by their original billNo)
  const activeBillNos = Object.keys(bills).sort((a, b) => parseInt(a) - parseInt(b));

  // Create a mapping from original billNo to display number (sequential)
  const billDisplayMap: Record<string, number> = {};
  activeBillNos.forEach((billNo, index) => {
    billDisplayMap[billNo] = index + 1;
  });

  return (
    <div>
      {activeBillNos.map((billNo) => {
        const bill = bills[billNo];
        const displayBillNo = billDisplayMap[billNo];
        const sectionKeys = Object.keys(bill.sections).sort();

        return (
          <div key={billNo} style={{ marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "12px", fontSize: "20px", fontWeight: "bold" }}>
              BILL {displayBillNo}: {bill.billName}
            </h2>

            {sectionKeys.map((sectionKey) => {
              const items = bill.sections[sectionKey];
              return (
                <div key={sectionKey} style={{ marginBottom: "24px" }}>
                  <h3 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}>
                    {sectionKey}
                  </h3>
                  <table style={tableStyle} border={1} cellPadding={8}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Unit</th>
                        <th style={thStyle}>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={`${item.billNo}|${item.section}|${item.description}|${item.unit}`}>
                          <td style={tdStyle}>{item.description}</td>
                          <td style={tdStyle}>{item.unit}</td>
                          <td style={tdStyle}>{item.qty.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}