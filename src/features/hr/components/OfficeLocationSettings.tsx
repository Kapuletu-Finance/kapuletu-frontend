"use client";

import { Building2, CheckCircle2, Loader2, MapPin, Search, Settings } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUpdateOfficeLocationMutation } from "@/features/hr/services/mutations";
import { useOfficeLocationQuery } from "@/features/hr/services/queries";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  addresstype: string;
}

const RADIUS_OPTIONS = [
  { label: "50m (strict)", value: "50" },
  { label: "100m", value: "100" },
  { label: "200m (recommended)", value: "200" },
  { label: "500m", value: "500" },
  { label: "1km (lenient)", value: "1000" },
];

export const OfficeLocationSettings: React.FC = () => {
  const { data: currentOffice, isLoading: isLoadingCurrent } = useOfficeLocationQuery();
  const updateMutation = useUpdateOfficeLocationMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<NominatimResult | null>(null);
  const [selectedRadius, setSelectedRadius] = useState("200");
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill if office is already configured
  useEffect(() => {
    if (currentOffice && !selectedLocation) {
      setSearchQuery(currentOffice.location_name);
      setSelectedRadius(currentOffice.radius_meters);
    }
  }, [currentOffice, selectedLocation]);

  // Nominatim search with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.trim().length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=7&addressdetails=1`,
          { headers: { "Accept-Language": "en" } },
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (result: NominatimResult) => {
    setSelectedLocation(result);
    setSearchQuery(result.display_name.split(",")[0]); // Use short name in field
    setShowDropdown(false);
    setResults([]);
  };

  const handleSave = () => {
    if (!selectedLocation) return;
    updateMutation.mutate({
      location_name: searchQuery || selectedLocation.display_name.split(",")[0],
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lon,
      radius_meters: selectedRadius,
    });
  };

  const isConfigured = !!currentOffice;
  const mapLat = selectedLocation?.lat ?? currentOffice?.latitude;
  const mapLon = selectedLocation?.lon ?? currentOffice?.longitude;

  return (
    <Card className="border-primary/20 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-teal-500" />
            Physical Office Location
          </span>
          {isConfigured && (
            <Badge
              variant="outline"
              className="gap-1.5 text-emerald-700 border-emerald-200 bg-emerald-50"
            >
              <CheckCircle2 className="h-3 w-3" /> Configured
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Set the GPS coordinates of your physical office. Employees selecting "Office (GPS)" must
          be within the allowed radius to successfully clock in.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Config Banner */}
        {isLoadingCurrent ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading current configuration...
          </div>
        ) : isConfigured ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900">
            <Building2 className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-teal-800 dark:text-teal-300 truncate">
                {currentOffice.location_name}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-mono">
                {parseFloat(currentOffice.latitude).toFixed(5)},{" "}
                {parseFloat(currentOffice.longitude).toFixed(5)}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                Allowed radius: <strong>{currentOffice.radius_meters}m</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <Settings className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">Not configured yet</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Physical clock-ins will be blocked until you set an office location below.
              </p>
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Search Office Location</p>
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLocation(null);
                }}
                placeholder="Type a building name, street, or area..."
                className="pl-9 pr-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
                {results.map((r) => (
                  <button
                    key={r.place_id}
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.display_name.split(",")[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.display_name.split(",").slice(1, 4).join(",")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedLocation && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              Selected: {selectedLocation.display_name.split(",").slice(0, 3).join(",")}
              &nbsp;·&nbsp;
              <span className="font-mono">
                {parseFloat(selectedLocation.lat).toFixed(5)},{" "}
                {parseFloat(selectedLocation.lon).toFixed(5)}
              </span>
            </p>
          )}
        </div>

        {/* Radius Selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Allowed Check-in Radius</p>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedRadius(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedRadius === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Employees clocking in physically must be within this distance of the office pin.
          </p>
        </div>

        {/* Map Preview */}
        {mapLat && mapLon && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Location Preview</p>
            <div className="rounded-xl overflow-hidden border border-border h-52 w-full">
              <iframe
                title="Office location map"
                className="w-full h-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(mapLon) - 0.005},${parseFloat(mapLat) - 0.005},${parseFloat(mapLon) + 0.005},${parseFloat(mapLat) + 0.005}&layer=mapnik&marker=${mapLat},${mapLon}`}
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={!selectedLocation || updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              {isConfigured ? "Update Office Location" : "Set Office Location"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
