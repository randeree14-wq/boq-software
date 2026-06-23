import * as XLSX from "xlsx";
import type { BoqItem } from "@/types/boq";

export function exportBOQToExcel(boqItems: Record<string, BoqItem>, projectName = "BOQ Export") {
  // 1. Group items by billNo → section
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

  // 2. Sort bills by original billNo (numeric)
  const sortedBillNos = Object.keys(bills).sort((a, b) => parseInt(a) - parseInt(b));

  // 3. Create sequential display numbers (same as BoqSummary)
  const billDisplayMap: Record<string, number> = {};
  sortedBillNos.forEach((billNo, index) => {
    billDisplayMap[billNo] = index + 1;
  });

  // 4. Build rows for Excel
  const rows: any[] = [];

  // Header
  rows.push(["BILL OF QUANTITIES"]);
  rows.push([`Project: ${projectName}`]);
  rows.push([`Date: ${new Date().toLocaleDateString()}`]);
  rows.push([]); // blank row

  let grandTotal = 0;

  sortedBillNos.forEach((billNo) => {
    const bill = bills[billNo];
    const displayBillNo = billDisplayMap[billNo];
    const sectionKeys = Object.keys(bill.sections).sort();

    // Bill header
    rows.push([`BILL ${displayBillNo}: ${bill.billName}`]);
    rows.push([]);

    let billTotal = 0;

    sectionKeys.forEach((sectionKey) => {
      const items = bill.sections[sectionKey];

      // Section header
      rows.push([sectionKey]);
      rows.push(["Description", "Unit", "Quantity"]);

      // Items
      items.forEach((item) => {
        rows.push([item.description, item.unit, item.qty]);
        billTotal += item.qty;
      });

      // Section subtotal
      const sectionTotal = items.reduce((sum, item) => sum + item.qty, 0);
      rows.push(["", "Subtotal", sectionTotal]);
      rows.push([]); // blank row
    });

    // Bill total
    rows.push([`TOTAL BILL ${displayBillNo}`, "", billTotal]);
    rows.push([]); // blank row

    grandTotal += billTotal;
  });

  // Grand total
  rows.push(["GRAND TOTAL", "", grandTotal]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Auto-size columns
  ws["!cols"] = [
    { wch: 60 }, // Description
    { wch: 12 }, // Unit
    { wch: 15 }, // Quantity
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BOQ");
  XLSX.writeFile(wb, `${projectName.replace(/\s+/g, "_")}_BOQ.xlsx`);
}