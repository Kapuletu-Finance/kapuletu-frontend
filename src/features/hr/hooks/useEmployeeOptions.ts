import { useMemo } from "react";
import { useAdminEmployeesQuery } from "@/features/admin/services/queries";

/** Active employees as `{ user_id: "First Last" }`, ready for a Select's `items`. */
export const useEmployeeOptions = (): Record<string, string> => {
  const { data: employees } = useAdminEmployeesQuery();
  return useMemo(
    () =>
      Object.fromEntries(
        (employees ?? [])
          .filter((e) => e.is_active)
          .map((e) => [e.user_id, `${e.first_name} ${e.last_name}`]),
      ),
    [employees],
  );
};
