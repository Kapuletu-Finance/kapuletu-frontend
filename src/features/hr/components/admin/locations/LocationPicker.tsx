"use client";

import { CheckCircle2, Loader2, MapPin, Search } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationPickerValue {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  radius_meters: number;
}

interface LocationPickerProps {
  value: LocationPickerValue;
  onChange: (value: LocationPickerValue, suggestedName?: string) => void;
}

const RADIUS_OPTIONS = [
  { label: "50 m (strict)", value: 50 },
  { label: "100 m", value: 100 },
  { label: "200 m (recommended)", value: 200 },
  { label: "500 m", value: 500 },
  { label: "1 km (lenient)", value: 1000 },
];

const SEARCH_DEBOUNCE_MS = 400;

/** Search a place (OpenStreetMap), pick the check-in radius, and preview the pin. */
export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=7`,
          { headers: { "Accept-Language": "en" } },
        );
        setResults(await res.json());
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const select = (result: NominatimResult) => {
    const shortName = result.display_name.split(",")[0];
    setQuery(shortName);
    setShowResults(false);
    setResults([]);
    onChange(
      {
        ...value,
        address: result.display_name,
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      },
      shortName,
    );
  };

  const hasPin = value.latitude !== null && value.longitude !== null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Find the place</p>
        <div className="relative" ref={containerRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a building name, street, or area..."
            className="pl-9 pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
          {showResults && results.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border bg-popover shadow-lg">
              {results.map((r) => (
                <button
                  key={r.place_id}
                  type="button"
                  onClick={() => select(r)}
                  className="flex w-full items-start gap-3 border-b px-4 py-3 text-left last:border-0 hover:bg-accent"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {r.display_name.split(",")[0]}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.display_name.split(",").slice(1, 4).join(",")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {hasPin && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            {value.address ? `${value.address.split(",").slice(0, 3).join(",")} · ` : ""}
            <span className="font-mono">
              {value.latitude?.toFixed(5)}, {value.longitude?.toFixed(5)}
            </span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Allowed check-in radius</p>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={value.radius_meters === opt.value}
              onClick={() => onChange({ ...value, radius_meters: opt.value })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                value.radius_meters === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:border-primary/50",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Clock-ins and meeting check-ins here must be within this distance of the pin.
        </p>
      </div>

      {hasPin && (
        <div className="h-52 w-full overflow-hidden rounded-xl border">
          <iframe
            title="Location preview"
            className="h-full w-full border-0"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(value.longitude as number) - 0.005},${(value.latitude as number) - 0.005},${(value.longitude as number) + 0.005},${(value.latitude as number) + 0.005}&layer=mapnik&marker=${value.latitude},${value.longitude}`}
          />
        </div>
      )}
    </div>
  );
};
