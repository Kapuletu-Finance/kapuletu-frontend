import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

// --- Types ---

export interface EmployeePermission {
  id: string;
  label: string;
  /** Screens this permission unlocks; empty when nothing checks it yet. */
  areas: string[];
}

export interface EmployeeProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  permissions: string[];
  is_active: boolean;
  created_at: string | null;
  last_login_at: string | null;
  last_active_at: string | null;
  /** Page the employee was last on (from the app heartbeat). */
  current_action: string | null;
  two_factor_enabled: boolean;
  sessions_revoked_at: string | null;
  reports_pending: number;
  reports_confirmed: number;
}

export interface EmployeeUpdateInput {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: string;
  permissions?: string[];
}

export type ActivityView = "performed" | "received" | "logins";

export interface ActivityItem {
  id: string;
  at: string;
  action: string;
  message: string;
  actor_id: string | null;
  actor_name: string | null;
}

export interface ActivityPage {
  items: ActivityItem[];
  total: number;
  page: number;
  limit: number;
}

export type EmployeeAccountAction = "suspend" | "restore" | "sign-out" | "reset-password";

// --- Keys & URLs ---

export const employeeProfileKeys = {
  activity: (userId: string, view: ActivityView, q: string, page: number) =>
    ["admin", "employee", userId, "activity", view, q, page] as const,
  employee: (userId: string) => ["admin", "employee", userId] as const,
  permissions: ["admin", "employee-permissions"] as const,
};

const EMPLOYEE_URL = (userId: string) => `/admin/employees/${userId}`;

// --- Queries ---

export const useEmployeePermissionsCatalogQuery = () =>
  useQuery({
    queryFn: async () =>
      (await apiClient.get<EmployeePermission[]>("/admin/employees/permissions")).data,
    queryKey: employeeProfileKeys.permissions,
    staleTime: Number.POSITIVE_INFINITY, // static catalogue
  });

export const useEmployeeProfileQuery = (userId: string) =>
  useQuery({
    queryFn: async () => (await apiClient.get<EmployeeProfile>(EMPLOYEE_URL(userId))).data,
    queryKey: employeeProfileKeys.employee(userId),
    retry: false, // a 404 means this id is a pending invite or unknown
  });

export const useEmployeeActivityQuery = (
  userId: string,
  view: ActivityView,
  q: string,
  page: number,
) =>
  useQuery({
    placeholderData: (previous) => previous,
    queryFn: async () =>
      (
        await apiClient.get<ActivityPage>(`${EMPLOYEE_URL(userId)}/activity`, {
          params: { limit: 20, page, q: q || undefined, view },
        })
      ).data,
    queryKey: employeeProfileKeys.activity(userId, view, q, page),
  });

// --- Mutations ---

const ACTION_MESSAGES: Record<EmployeeAccountAction, string> = {
  "reset-password": "Password reset code sent.",
  restore: "Account restored. They can sign in again.",
  "sign-out": "Signed out of all sessions.",
  suspend: "Account suspended and signed out everywhere.",
};

const useInvalidateEmployee = () => {
  const queryClient = useQueryClient();
  return (userId: string) => {
    queryClient.invalidateQueries({ queryKey: employeeProfileKeys.employee(userId) });
    queryClient.invalidateQueries({ queryKey: ["admin_employees"] });
  };
};

export const useUpdateEmployeeMutation = () => {
  const invalidate = useInvalidateEmployee();
  return useMutation({
    mutationFn: async ({ userId, payload }: { userId: string; payload: EmployeeUpdateInput }) =>
      (await apiClient.patch<EmployeeProfile>(EMPLOYEE_URL(userId), payload)).data,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (profile) => {
      invalidate(profile.user_id);
      toast.success("Employee updated. They have been notified.");
    },
  });
};

export const useEmployeeAccountActionMutation = () => {
  const invalidate = useInvalidateEmployee();
  return useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: EmployeeAccountAction }) =>
      (await apiClient.post(`${EMPLOYEE_URL(userId)}/${action}`)).data,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (_, { userId, action }) => {
      invalidate(userId);
      toast.success(ACTION_MESSAGES[action]);
    },
  });
};
