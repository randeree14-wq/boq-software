import type { BoqItem, BrickType, WallThicknessType } from "@/types/boq";

export function addToBoqItem(boq: Record<string, BoqItem>, itemName: string, unit: string, qty: number) {
  if (!boq[itemName]) {
    boq[itemName] = { item: itemName, unit, qty: 0 };
  }
  boq[itemName].qty += qty;
}

export function addLayerToBoq(boq: Record<string, BoqItem>, material: string, thickness: number, area: number) {
  if (material && thickness > 0) {
    addToBoqItem(boq, `${thickness}mm ${material} compacted`, "m²", area);
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