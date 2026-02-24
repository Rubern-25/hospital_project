export function formatTzs(value: number | string): string {
  const amount = typeof value === "number" ? value : Number.parseFloat(value || "0")
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount)
}
