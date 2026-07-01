import { CostSnapshot, ComputedMeasurementItem, ElementalSummary } from "@/types/boq";

export type ComparisonResult = {
  added: ComputedMeasurementItem[];
  removed: ComputedMeasurementItem[];
  changed: {
    itemId: string;
    oldAmount: number;
    newAmount: number;
    difference: number;
  }[];
  totalDifference: number;
};

export class SnapshotManager {
  /**
   * Create a new snapshot of computed items and summary for a Cost Plan.
   */
  createSnapshot(
    costPlanId: string,
    projectId: string,
    computedItems: ComputedMeasurementItem[],
    summary: ElementalSummary,
    version: number,
    note?: string
  ): CostSnapshot {
    return {
      id: `snapshot-${Date.now()}-${costPlanId}`,
      projectId,
      costPlanId,
      timestamp: new Date().toISOString(),
      version,
      computedItems: computedItems.map(item => ({ ...item })), // Deep copy
      totalValue: summary.totalValue,
      note,
    };
  }

  /**
   * Get all snapshots for a specific Cost Plan.
   */
  getSnapshotsForCostPlan(
    costPlanId: string,
    snapshots: CostSnapshot[]
  ): CostSnapshot[] {
    return snapshots
      .filter(s => s.costPlanId === costPlanId)
      .sort((a, b) => a.version - b.version);
  }

  /**
   * Get the latest snapshot for a Cost Plan.
   */
  getLatestSnapshot(
    costPlanId: string,
    snapshots: CostSnapshot[]
  ): CostSnapshot | null {
    const filtered = this.getSnapshotsForCostPlan(costPlanId, snapshots);
    return filtered.length > 0 ? filtered[filtered.length - 1] : null;
  }

  /**
   * Compare two snapshots and return differences.
   */
  compareSnapshots(
    snapshotA: CostSnapshot,
    snapshotB: CostSnapshot
  ): ComparisonResult {
    const mapA = new Map(snapshotA.computedItems.map(item => [item.id, item]));
    const mapB = new Map(snapshotB.computedItems.map(item => [item.id, item]));

    const added: ComputedMeasurementItem[] = [];
    const removed: ComputedMeasurementItem[] = [];
    const changed: { itemId: string; oldAmount: number; newAmount: number; difference: number }[] = [];

    // Find added and changed
    for (const [id, itemB] of mapB) {
      const itemA = mapA.get(id);
      if (!itemA) {
        added.push(itemB);
      } else if (itemA.amount !== itemB.amount) {
        changed.push({
          itemId: id,
          oldAmount: itemA.amount,
          newAmount: itemB.amount,
          difference: itemB.amount - itemA.amount,
        });
      }
    }

    // Find removed
    for (const [id] of mapA) {
      if (!mapB.has(id)) {
        removed.push(mapA.get(id)!);
      }
    }

    return {
      added,
      removed,
      changed,
      totalDifference: snapshotB.totalValue - snapshotA.totalValue,
    };
  }

  /**
   * Generate a revision note automatically based on comparison.
   */
  generateRevisionNote(
    snapshotA: CostSnapshot | null,
    snapshotB: CostSnapshot
  ): string {
    if (!snapshotA) {
      return `Initial snapshot (version ${snapshotB.version})`;
    }
    const diff = this.compareSnapshots(snapshotA, snapshotB);
    const parts: string[] = [];
    if (diff.added.length > 0) parts.push(`${diff.added.length} items added`);
    if (diff.removed.length > 0) parts.push(`${diff.removed.length} items removed`);
    if (diff.changed.length > 0) parts.push(`${diff.changed.length} items changed`);
    const totalDiff = diff.totalDifference;
    const sign = totalDiff >= 0 ? "+" : "";
    parts.push(`total ${sign}${totalDiff.toFixed(2)}`);
    return `Revision ${snapshotB.version}: ${parts.join(", ")}`;
  }
}