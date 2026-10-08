"use client";

import type React from "react";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkLocationsQuery } from "@/features/hr/services/queries";

const DEFAULT = "default";

interface VenueSelectProps {
  /** Chosen location id, or null for "use the default location". */
  value: string | null;
  onChange: (locationId: string | null) => void;
  id?: string;
  className?: string;
}

/** Picks the venue for an in-person meeting or physical day; "Default" follows the default location. */
export const VenueSelect: React.FC<VenueSelectProps> = ({ value, onChange, id, className }) => {
  const { data: locations } = useWorkLocationsQuery();

  const items = useMemo(() => {
    const defaultLocation = locations?.find((l) => l.is_default);
    const entries: [string, string][] = [
      [DEFAULT, defaultLocation ? `Default — ${defaultLocation.name}` : "Default location"],
      ...(locations ?? [])
        // Keep the currently chosen venue listed even if it has since been archived.
        .filter((l) => !l.is_default && (l.is_active || l.id === value))
        .map((l): [string, string] => [l.id, l.is_active ? l.name : `${l.name} (archived)`]),
    ];
    return Object.fromEntries(entries);
  }, [locations, value]);

  return (
    <Select
      items={items}
      value={value ?? DEFAULT}
      onValueChange={(v) => onChange(!v || v === DEFAULT ? null : v)}
    >
      <SelectTrigger id={id} className={className ?? "w-full"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(items).map(([itemValue, label]) => (
          <SelectItem key={itemValue} value={itemValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
