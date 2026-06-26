"use client";

import type { BoqItem } from "@/types/boq";

interface BoqSummaryProps {
  boqItems: Record<string, BoqItem>;
  rates: Record<string, number>;
  onRateChange: (key: string, rate: number) => void;
  styles: any;
}

export default function BoqSummary({
  boqItems,
  rates,
  onRateChange,
  styles,
}: BoqSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles || {};

  const safeBoqItems = boqItems || {};

  // Group by bill
  const bills: Record<string, BoqItem[]> = {};
  Object.values(safeBoqItems).forEach((item) => {
    if (!bills[item.billNo]) {
      bills[item.billNo] = [];
    }
    bills[item.billNo].push(item);
  });

  const sortedBillKeys = Object.keys(bills).sort();

  if (Object.keys(safeBoqItems).length === 0) {
    return (
      <div style={cardStyle}>
        <p>No BOQ items yet. Add measurements to generate BOQ items.</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <table style={tableStyle} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th style={thStyle}>Bill</th>
            <th style={thStyle}>Section</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Rate (R)</th>
            <th style={thStyle}>Amount (R)</th>
          </tr>
        </thead>
        <tbody>
          {sortedBillKeys.map((billKey) => {
            const items = bills[billKey];
            let billTotal = 0;

            return (
              <React.Fragment key={billKey}>
                <tr style={{ backgroundColor: "#f0f4f8", fontWeight: "bold" }}>
                  <td style={tdStyle} colSpan={7}>
                    {billKey}
                  </td>
                </tr>
                {items.map((item) => {
                  const rate = rates[`${item.billNo}|${item.section}|${item.description}|${item.unit}`] || item.rate || 0;
                  const amount = (item.qty || 0) * rate;
                  billTotal += amount;

                  return (
                    <tr key={`${item.billNo}|${item.section}|${item.description}|${item.unit}`}>
                      <td style={tdStyle}></td>
                      <td style={tdStyle}>{item.section}</td>
                      <td style={tdStyle}>{item.description}</td>
                      <td style={tdStyle}>{item.unit}</td>
                      <td style={tdStyle}>{((item.qty || 0)).toFixed(3)}</td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={rate || ''}
                          onChange={(e) => {
                            const newRate = Number(e.target.value) || 0;
                            onRateChange(
                              `${item.billNo}|${item.section}|${item.description}|${item.unit}`,
                              newRate
                            );
                          }}
                          style={{ width: "100px", padding: "4px" }}
                          step="0.01"
                        />
                      </td>
                      <td style={tdStyle}>{(amount || 0).toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: "bold", backgroundColor: "#e8edf2" }}>
                  <td style={{ ...tdStyle, fontStyle: "italic" }} colSpan={6}>
                    Bill Subtotal
                  </td>
                  <td style={tdStyle}>{(billTotal || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={7} style={{ padding: "4px" }} />
                </tr>
              </React.Fragment>
            );
          })}
          <tr style={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#d9e2ec" }}>
            <td style={tdStyle} colSpan={6}>
              GRAND TOTAL
            </td>
            <td style={tdStyle}>
              {Object.values(safeBoqItems).reduce((sum, item) => {
                const rate = rates[`${item.billNo}|${item.section}|${item.description}|${item.unit}`] || item.rate || 0;
                return sum + ((item.qty || 0) * rate);
              }, 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}