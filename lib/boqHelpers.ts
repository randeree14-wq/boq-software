import type { BoqItem, BrickType, WallThicknessType } from "@/types/boq";
import { getBill } from "./boqStructure";
import type { BillKey } from "./boqStructure";

export function addToBoqItem(boq: Record<string, BoqItem>, itemName: string, unit: string, qty: number) {
  if (!boq[itemName]) {
    boq[itemName] = { item: itemName, unit, qty: 0 };
  }
  boq[itemName].qty += qty;
}

export function addLayerToBoq(
  boq: Record<string, BoqItem>,
  material: string,
  thickness: number,
  area: number,
  contribution?: { module: string; measurementId: number; mark: string; qty: number }
) {
  if (material && thickness > 0) {
    addBoqItem(boq, "2", "EARTHWORKS", "Layerworks", `${thickness}mm ${material} compacted`, "m²", area, contribution);
  }
}

export function getBrickDefaults(brickType: BrickType) {
  switch (brickType) {
    case "Common": return { courseHeight: 75 };
    case "Imperial": return { courseHeight: 80 };
    case "Maxi 90": return { courseHeight: 100 };
    default: return { courseHeight: 75 };
  }
}

export function getThicknessFromType(thicknessType: WallThicknessType): number {
  switch (thicknessType) {
    case "Single Skin (Half Brick)": return 102;
    case "Double Skin (One Brick)": return 215;
    case "Cavity Wall": return 275;
    case "Triple Skin": return 327;
    default: return 102;
  }
}

// BOQ Aggregation Helper
export function addBoqItem(
  boq: Record<string, BoqItem>,
  billNo: string,
  billName: string,
  section: string,
  description: string,
  unit: string,
  qty: number,
  contribution?: { module: string; measurementId: number; mark: string; qty: number }
) {
  const key = `${billNo}|${section}|${description}|${unit}`;
  if (boq[key]) {
    boq[key].qty += qty;
    if (contribution) {
      boq[key].contributions.push(contribution);
    }
  } else {
    boq[key] = {
      billNo,
      billName,
      section,
      description,
      unit,
      qty,
      contributions: contribution ? [contribution] : [],
    };
  }
}
export function addBoqItemFromBillKey(
  boqItems: Record<string, BoqItem>,
  billKey: string,
  section: string,
  description: string,
  unit: string,
  qty: number,
  contribution: { module: string; measurementId: number; mark: string; qty: number }
) {
  // Safeguard against null/undefined
  const safeQty = qty || 0;
  const safeContribQty = contribution.qty || 0;
  
  const key = `${billKey}|${section}|${description}|${unit}`;
  
  if (!boqItems[key]) {
    boqItems[key] = {
      billNo: billKey,
      billName: billKey,
      section: section,
      description: description,
      unit: unit,
      qty: 0,
      contributions: [],
    };
  }
  
  boqItems[key].qty += safeQty;
  boqItems[key].contributions.push({
    module: contribution.module,
    measurementId: contribution.measurementId,
    mark: contribution.mark,
    qty: safeContribQty,
  });
}