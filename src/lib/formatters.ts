export function formatCurrency(amount: number): string {
  if (Number.isNaN(amount)) return "0";
  return new Intl.NumberFormat("en-KE").format(amount);
}

export function formatNumber(amount: number): string {
  if (Number.isNaN(amount)) return "0";
  return new Intl.NumberFormat("en-KE").format(amount);
}
