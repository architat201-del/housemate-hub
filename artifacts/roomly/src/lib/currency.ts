const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupees using the Indian numbering system.
 * e.g.  4200 → ₹4,200   |  25000 → ₹25,000  |  150000 → ₹1,50,000
 */
export function formatINR(amount: number): string {
  return INR_FORMATTER.format(amount);
}
