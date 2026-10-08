/**
 * Hooks for finance reports, report schedules, reconciliation, contribution volume and ledger integrity
 * (/admin/finance/*). Every route needs the manage_finance permission.
 */
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { downloadFile } from "@/lib/download";
import { errorMessage, FINANCE_KEY, type Paged, toQuery } from "./financeApi";

// --- reports ---

export type ReportKey = "revenue" | "refunds" | "receivables" | "payment_methods" | "tax";
export type ReportFormat = "csv" | "excel" | "pdf";

export interface ReportInfo {
  key: ReportKey;
  title: string;
  description: string;
}

export interface ReportData {
  key: ReportKey;
  title: string;
  description: string;
  period: { from: string; to: string; label: string };
  figures: { label: string; value: string }[];
  tables: {
    title: string;
    columns: string[];
    rows: (string | number)[][];
    numeric_cols: number[];
  }[];
}

export const useReportCatalogueQuery = () =>
  useQuery({
    queryKey: [...FINANCE_KEY, "reports"],
    queryFn: async () => (await apiClient.get<ReportInfo[]>("/admin/finance/reports")).data,
  });

export const useReportQuery = (key: ReportKey | null, from?: string, to?: string) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "report", key, from, to],
    queryFn: async () =>
      (await apiClient.get<ReportData>(`/admin/finance/reports/${key}${toQuery({ from, to })}`))
        .data,
    enabled: !!key,
    placeholderData: keepPreviousData,
  });

export const useDownloadReportMutation = () =>
  useMutation({
    mutationFn: ({
      key,
      format,
      from,
      to,
    }: {
      key: ReportKey;
      format: ReportFormat;
      from?: string;
      to?: string;
    }) =>
      downloadFile(`/admin/finance/reports/${key}`, {
        fallbackName: `kapuletu_${key}.${format === "excel" ? "xlsx" : format}`,
        params: { format, from, to },
      }),
    onError: (error) => toast.error(errorMessage(error, "Could not download the report.")),
  });

export const useDownloadFinanceInvoiceMutation = () =>
  useMutation({
    mutationFn: ({ invoiceId, number }: { invoiceId: string; number: string }) =>
      downloadFile(`/admin/finance/invoices/${invoiceId}/pdf`, {
        fallbackName: `${number}.pdf`,
      }),
    onError: (error) => toast.error(errorMessage(error, "Could not download the invoice.")),
  });

export interface ReportSchedule {
  schedule_id: string;
  report_type: ReportKey;
  frequency: "weekly" | "monthly";
  format: ReportFormat;
  recipients: string[];
  is_active: boolean;
  last_sent_at: string | null;
  last_period_end: string | null;
  last_error: string | null;
  created_at: string;
}

const SCHEDULES_KEY = [...FINANCE_KEY, "report-schedules"];

export const useReportSchedulesQuery = () =>
  useQuery({
    queryKey: SCHEDULES_KEY,
    queryFn: async () =>
      (await apiClient.get<ReportSchedule[]>("/admin/finance/reports/schedules")).data,
  });

const useScheduleMutation = <V>(fn: (v: V) => Promise<unknown>, done: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      toast.success(done);
      queryClient.invalidateQueries({ queryKey: SCHEDULES_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not update the schedule.")),
  });
};

export const useCreateScheduleMutation = () =>
  useScheduleMutation(
    async (body: {
      report_type: ReportKey;
      frequency: string;
      format: ReportFormat;
      recipients: string[];
    }) => (await apiClient.post("/admin/finance/reports/schedules", body)).data,
    "Report scheduled.",
  );

export const useUpdateScheduleMutation = () =>
  useScheduleMutation(
    async ({ id, ...body }: { id: string; is_active?: boolean }) =>
      (await apiClient.patch(`/admin/finance/reports/schedules/${id}`, body)).data,
    "Schedule updated.",
  );

export const useDeleteScheduleMutation = () =>
  useScheduleMutation(
    async (id: string) => (await apiClient.delete(`/admin/finance/reports/schedules/${id}`)).data,
    "Schedule removed.",
  );

export const useSendScheduleNowMutation = () =>
  useScheduleMutation(
    async (id: string) =>
      (await apiClient.post(`/admin/finance/reports/schedules/${id}/send`)).data,
    "Report sent.",
  );

// --- reconciliation ---

export type ReconciliationStatus =
  | "matched"
  | "amount_mismatch"
  | "missing_in_ledger"
  | "missing_in_statement";
export type OpenMismatchStatus = Exclude<ReconciliationStatus, "matched">;

export interface ReconciliationRun {
  run_id: string;
  provider: "mpesa" | "flutterwave";
  source: "upload" | "api";
  source_name: string | null;
  period_start: string | null;
  period_end: string | null;
  lines: number;
  matched: number;
  mismatched: number;
  created_at: string;
}

export interface ReconciliationItem {
  item_id: string;
  provider: "mpesa" | "flutterwave";
  status: ReconciliationStatus;
  match_method: string | null;
  provider_ref: string | null;
  provider_amount: number | null;
  provider_at: string | null;
  counterparty: string | null;
  payment_id: string | null;
  ledger_amount: number | null;
  payment_at: string | null;
  user_id: string | null;
  user_name: string | null;
  resolution: "resolved" | "ignored" | null;
  resolution_note: string | null;
  resolved_at: string | null;
  raw: Record<string, unknown> | null;
}

const RECON_KEY = [...FINANCE_KEY, "reconciliation"];

export const useReconciliationSummaryQuery = () =>
  useQuery({
    queryKey: [...RECON_KEY, "summary"],
    queryFn: async () =>
      (
        await apiClient.get<Record<OpenMismatchStatus, number>>(
          "/admin/finance/reconciliation/summary",
        )
      ).data,
  });

export const useReconciliationRunsQuery = () =>
  useQuery({
    queryKey: [...RECON_KEY, "runs"],
    queryFn: async () =>
      (await apiClient.get<Paged<ReconciliationRun>>("/admin/finance/reconciliation/runs")).data,
  });

export const useReconciliationItemsQuery = (filters: {
  status?: string;
  provider?: string;
  openOnly?: boolean;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: [...RECON_KEY, "items", filters],
    queryFn: async () =>
      (
        await apiClient.get<Paged<ReconciliationItem>>(
          `/admin/finance/reconciliation/items${toQuery({
            status: filters.status,
            provider: filters.provider,
            open_only: filters.openOnly === false ? "false" : undefined,
            page: filters.page,
            limit: filters.limit,
          })}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

const useReconciliationMutation = <V>(fn: (v: V) => Promise<ReconciliationRun>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (run) => {
      toast.success(
        `Reconciled ${run.lines} lines: ${run.matched} matched, ${run.mismatched} to review.`,
      );
      queryClient.invalidateQueries({ queryKey: RECON_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Reconciliation failed.")),
  });
};

export const useUploadMpesaStatementMutation = () =>
  useReconciliationMutation(async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return (
      await apiClient.post<ReconciliationRun>("/admin/finance/reconciliation/mpesa", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  });

export const usePullFlutterwaveMutation = () =>
  useReconciliationMutation(
    async ({ from, to }: { from: string; to: string }) =>
      (
        await apiClient.post<ReconciliationRun>("/admin/finance/reconciliation/flutterwave", {
          from,
          to,
        })
      ).data,
  );

export const useResolveReconciliationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      itemId,
      ...body
    }: {
      itemId: string;
      resolution: "resolved" | "ignored";
      note: string;
    }) =>
      (await apiClient.post(`/admin/finance/reconciliation/items/${itemId}/resolve`, body)).data,
    onSuccess: () => {
      toast.success("Mismatch closed.");
      queryClient.invalidateQueries({ queryKey: RECON_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not close the mismatch.")),
  });
};

// --- contribution volume & integrity ---

export interface ContributionVolume {
  period: { from: string; to: string };
  totals: {
    contributions: number;
    amount: number;
    active_groups: number;
    active_treasurers: number;
    average_contribution: number;
  };
  by_month: { month: string; contributions: number; amount: number }[];
  by_method: { method: string; contributions: number; amount: number }[];
  top_groups: {
    group_id: string;
    group_name: string;
    treasurer: string;
    treasurer_id: string;
    contributions: number;
    amount: number;
  }[];
}

export const useContributionVolumeQuery = (from?: string, to?: string) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "volume", from, to],
    queryFn: async () =>
      (await apiClient.get<ContributionVolume>(`/admin/finance/volume${toQuery({ from, to })}`))
        .data,
    placeholderData: keepPreviousData,
  });

export interface IntegrityResult {
  period: { from: string; to: string };
  checked: number;
  intact: number;
  unsealed: number;
  truncated: boolean;
  tampered: {
    transaction_id: string;
    group_name: string | null;
    transaction_code: string;
    amount: number;
    created_at: string;
  }[];
}

export const useIntegrityCheckMutation = () =>
  useMutation({
    mutationFn: async ({ from, to }: { from?: string; to?: string }) =>
      (await apiClient.post<IntegrityResult>(`/admin/finance/integrity${toQuery({ from, to })}`))
        .data,
    onError: (error) => toast.error(errorMessage(error, "Integrity check failed.")),
  });
