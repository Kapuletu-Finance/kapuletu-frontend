import { FinanceShell } from "@/features/admin/components/finance/FinanceShell";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <FinanceShell>{children}</FinanceShell>;
}
