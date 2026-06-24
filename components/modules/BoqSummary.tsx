"use client";

import type { BoqItem } from "@/types/boq";

interface BoqSummaryProps {
  boqItems: Record<string, BoqItem>;
  rates: Record<string, number>;
  onRateChange: (key: string, rate: number) => void;
  styles: {
    tableStyle: React.CSSProperties;
    thStyle: React.CSSProperties;
    tdStyle: React.CSSProperties;
  };
}

export default function BoqSummary({ boqItems, rates, onRateChange, styles }: BoqSummaryProps) {
  const { tableStyle, thStyle, tdStyle } = styles;

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

  const activeBillNos = Object.keys(bills).sort((a, b) => parseInt(a) - parseInt(b));
  const billDisplayMap: Record<string, number> = {};
  activeBillNos.forEach((billNo, index) => {
    billDisplayMap[billNo] = index + 1;
  });

  // Helper to get rate for an item
  const getRate = (item: BoqItem): number => {
    const key = `${item.billNo}|${item.section}|${item.description}|${item.unit}`;
    return rates[key] || 0;
  };

  // Helper to get amount for an item
  const getAmount = (item: BoqItem): number => {
    const rate = getRate(item);
    return item.qty * rate;
  };

  // Calculate grand total
  let grandTotal = 0;

  return (
    <div>
      {activeBillNos.map((billNo) => {
        const bill = bills[billNo];
        const displayBillNo = billDisplayMap[billNo];
        const sectionKeys = Object.keys(bill.sections).sort();
        let billTotal = 0;

        return (
          <div key={billNo} style={{ marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "12px", fontSize: "20px", fontWeight: "bold" }}>
              BILL {displayBillNo}: {bill.billName}
            </h2>

            {sectionKeys.map((sectionKey) => {
              const items = bill.sections[sectionKey];
              let sectionTotal = 0;

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
                        <th style={thStyle}>Rate (R)</th>
                        <th style={thStyle}>Amount (R)</th>
                        <th style={thStyle}>Trace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const key = `${item.billNo}|${item.section}|${item.description}|${item.unit}`;
                        const rate = getRate(item);
                        const amount = getAmount(item);
                        sectionTotal += amount;
                        billTotal += amount;
                        grandTotal += amount;

                        const hasContributions = item.contributions && item.contributions.length > 0;

                        return (
                          <tr key={key}>
                            <td style={tdStyle}>{item.description}</td>
                            <td style={tdStyle}>{item.unit}</td>
                            <td style={tdStyle}>{item.qty.toFixed(3)}</td>
                            <td style={tdStyle}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={rate || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  onRateChange(key, isNaN(val) ? 0 : val);
                                }}
                                style={{
                                  width: "100px",
                                  padding: "4px 6px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </td>
                            <td style={tdStyle}>{amount.toFixed(2)}</td>
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
                      {/* Section subtotal */}
                      <tr style={{ fontWeight: "bold" }}>
                        <td colSpan={4} style={{ textAlign: "right", padding: "8px" }}>Section Subtotal:</td>
                        <td style={{ padding: "8px" }}>{sectionTotal.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
            {/* Bill total */}
            <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", marginTop: "8px" }}>
              Bill {displayBillNo} Total: R {billTotal.toFixed(2)}
            </div>
          </div>
        );
      })}
      {/* Grand total */}
      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "20px", marginTop: "24px", padding: "12px", borderTop: "2px solid #333" }}>
        GRAND TOTAL: R {grandTotal.toFixed(2)}
      </div>
    </div>
  );
}