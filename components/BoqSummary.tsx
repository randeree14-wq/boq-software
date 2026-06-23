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

  if (!boqItems || Object.keys(boqItems).length === 0) {
    return <p>No BOQ items generated yet. Add measurements to see the summary.</p>;
  }

  // Group by billNo → section
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

  const activeBillNos = Object.keys(bills).sort((a, b) => parseInt(a) - parseInt(b));
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
                        <th style={thStyle}>Trace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const hasContributions = item.contributions && item.contributions.length > 0;
                        return (
                          <tr key={`${item.billNo}|${item.section}|${item.description}|${item.unit}`}>
                            <td style={tdStyle}>{item.description}</td>
                            <td style={tdStyle}>{item.unit}</td>
                            <td style={tdStyle}>{item.qty.toFixed(3)}</td>
                            <td style={tdStyle}>
                              {hasContributions ? (
                                <details>
                                  <summary style={{ cursor: "pointer", color: "#0066cc" }}>
                                    View sources ({item.contributions.length})
                                  </summary>
                                  <table style={{ width: "100%", marginTop: "8px", borderCollapse: "collapse", fontSize: "0.9em" }}>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: "left", padding: "2px 6px" }}>Module</th>
                                        <th style={{ textAlign: "left", padding: "2px 6px" }}>Mark</th>
                                        <th style={{ textAlign: "right", padding: "2px 6px" }}>Qty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.contributions.map((c, idx) => (
                                        <tr key={idx}>
                                          <td style={{ padding: "2px 6px" }}>{c.module}</td>
                                          <td style={{ padding: "2px 6px" }}>{c.mark}</td>
                                          <td style={{ padding: "2px 6px", textAlign: "right" }}>{c.qty.toFixed(3)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </details>
                              ) : (
                                <span style={{ color: "#999" }}>–</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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