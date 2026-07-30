import type * as React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

interface PasswordRequirementProps {
  label: string;
  meets: boolean;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ label, meets }) => {
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
          meets ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive",
        )}
      >
        {meets ? (
          <IconLibrary name="check" className="w-3 h-3 stroke-3" />
        ) : (
          <IconLibrary name="close" className="w-3 h-3 stroke-3" />
        )}
      </div>
      <span className={cn("text-xs font-medium", meets ? "text-primary" : "text-destructive")}>
        {label}
      </span>
    </div>
  );
};

const requirements = [
  { re: /.{8,}/, label: "At least 8 characters" },
  { re: /[0-9]/, label: "Includes number" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[^A-Za-z0-9]/, label: "Includes special symbol" },
];

interface PasswordRequirementsProps {
  password?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password = "" }) => {
  return (
    <div className="flex flex-col mt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 gap-x-4">
        {requirements.map((req) => (
          <PasswordRequirement key={req.label} label={req.label} meets={req.re.test(password)} />
        ))}
      </div>
    </div>
  );
};
