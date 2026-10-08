"use client";

import { Building2, MapPin, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LocationPicker,
  type LocationPickerValue,
} from "@/features/hr/components/admin/locations/LocationPicker";
import { toneClasses } from "@/features/hr/components/shared/HrBadges";
import {
  useSaveWorkLocationMutation,
  useWorkLocationActionMutation,
} from "@/features/hr/services/mutations";
import { useWorkLocationsQuery } from "@/features/hr/services/queries";
import type { WorkLocation } from "@/features/hr/types";
import { cn } from "@/lib/utils";

const LocationFormDialog: React.FC<{ location?: WorkLocation; onClose: () => void }> = ({
  location,
  onClose,
}) => {
  const [name, setName] = useState(location?.name ?? "");
  const [place, setPlace] = useState<LocationPickerValue>({
    address: location?.address ?? null,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    radius_meters: location?.radius_meters ?? 200,
  });
  const save = useSaveWorkLocationMutation();
  const canSave = name.trim() && place.latitude !== null && place.longitude !== null;

  const handleSave = () => {
    if (!canSave) return;
    save.mutate(
      {
        id: location?.id,
        payload: {
          address: place.address,
          latitude: place.latitude as number,
          longitude: place.longitude as number,
          name: name.trim(),
          radius_meters: place.radius_meters,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{location ? `Edit ${location.name}` : "Add work location"}</DialogTitle>
          <DialogDescription>
            A place employees can be required to attend: the office, a branch, or an event venue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location-name">Name</Label>
            <Input
              id="location-name"
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kapuletu HQ"
            />
          </div>
          <LocationPicker
            value={place}
            onChange={(next, suggestedName) => {
              setPlace(next);
              if (!name.trim() && suggestedName) setName(suggestedName);
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || save.isPending}>
            {save.isPending ? "Saving..." : "Save location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Office and other venues; physical days and in-person meetings are geofenced against them. */
export const WorkLocationsCard: React.FC = () => {
  const { data: locations, isLoading } = useWorkLocationsQuery();
  const action = useWorkLocationActionMutation();
  const [editing, setEditing] = useState<{ location?: WorkLocation } | null>(null);

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Work locations
          </CardTitle>
          <CardDescription>
            The <strong>default</strong> location (usually the office) applies to every physical day
            and in-person meeting unless another venue is chosen. Check-ins outside a
            location&apos;s radius are rejected.
          </CardDescription>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" /> Add location
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !locations?.length ? (
          <div className={cn("rounded-lg border p-4 text-sm", toneClasses("amber"))}>
            No work location yet. Physical clock-ins and in-person meetings are blocked until you
            add one; the first location becomes the default.
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {locations.map((location) => (
              <div
                key={location.id}
                className={cn(
                  "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
                  !location.is_active && "opacity-60",
                )}
              >
                <Building2 className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{location.name}</p>
                    {location.is_default && <Badge>Default</Badge>}
                    {!location.is_active && <Badge variant="secondary">Archived</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {location.address ? `${location.address} · ` : ""}within{" "}
                    {location.radius_meters} m
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing({ location })}>
                    Edit
                  </Button>
                  {location.is_active && !location.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={action.isPending}
                      onClick={() => action.mutate({ action: "default", id: location.id })}
                    >
                      Make default
                    </Button>
                  )}
                  {!location.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={action.isPending}
                      onClick={() =>
                        action.mutate({
                          action: location.is_active ? "archive" : "restore",
                          id: location.id,
                        })
                      }
                    >
                      {location.is_active ? "Archive" : "Restore"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {editing && (
        <LocationFormDialog location={editing.location} onClose={() => setEditing(null)} />
      )}
    </Card>
  );
};
