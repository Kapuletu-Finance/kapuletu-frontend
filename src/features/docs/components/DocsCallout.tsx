import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface DocsCalloutProps {
  type: "info" | "warning" | "important" | "tip" | "caution";
  title?: string;
  children: React.ReactNode;
}

export const DocsCallout: React.FC<DocsCalloutProps> = ({ type, title, children }) => {
  const styles = {
    info: "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    warning:
      "bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
    important:
      "bg-purple-50/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300",
    tip: "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
    caution:
      "bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
  };

  const icons = {
    info: <IconLibrary name="info" className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    warning: (
      <IconLibrary name="triangle-alert" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    ),
    important: (
      <IconLibrary name="alert" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    ),
    tip: <IconLibrary name="lightbulb" className="w-5 h-5 text-green-600 dark:text-green-400" />,
    caution: <IconLibrary name="alert" className="w-5 h-5 text-red-600 dark:text-red-400" />,
  };

  return (
    <div className={`my-6 flex gap-4 rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
};
