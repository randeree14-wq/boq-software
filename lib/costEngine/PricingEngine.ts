import { MeasurementItem } from "@/types/boq";

export class PricingEngine {
  /**
   * Deterministic amount calculation: amount = quantity × rate
   */
  calculateAmount(quantity: number, rate: number): number {
    if (quantity < 0 || rate < 0) return 0;
    return quantity * rate;
  }

  /**
   * Bulk calculate amounts for multiple items.
   */
  calculateAmounts(
    items: Array<{ quantity: number; rate: number }>
  ): number[] {
    return items.map(({ quantity, rate }) => this.calculateAmount(quantity, rate));
  }
}