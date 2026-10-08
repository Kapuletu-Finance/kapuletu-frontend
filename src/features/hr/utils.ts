import { endOfMonth, format, startOfMonth } from "date-fns";
import type { Coordinates, DateRange, DayMode } from "@/features/hr/types";

export const WEEKDAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAY_MODE_LABELS: Record<DayMode, string> = {
  off: "Off",
  online: "Online",
  physical: "Physical",
};

/** Formats a role slug such as "support_agent" as "Support Agent". */
export const formatRole = (role: string) =>
  role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** "08:00:00" -> "08:00" (the API stores Nairobi local times). */
export const formatClock = (time: string | null | undefined) => (time ? time.slice(0, 5) : "—");

/** "08:00" -> "08:00:00" for the API. */
export const toApiTime = (time: string) => (time.length === 5 ? `${time}:00` : time);

/** Date -> "YYYY-MM-DD" in local time (no UTC shift). */
export const toDateParam = (date: Date) => format(date, "yyyy-MM-dd");

/** Parses an API "YYYY-MM-DD" date as a local calendar date. */
export const parseDateParam = (value: string) => new Date(`${value}T00:00:00`);

export const monthRange = (date: Date): DateRange => ({
  end: toDateParam(endOfMonth(date)),
  start: toDateParam(startOfMonth(date)),
});

export const formatTimeOfDay = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

export const formatMeetingWindow = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();
  const day = startDate.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
  const endLabel = sameDay
    ? formatTimeOfDay(end)
    : `${endDate.toLocaleDateString([], { day: "numeric", month: "short" })} ${formatTimeOfDay(end)}`;
  return `${day}, ${formatTimeOfDay(start)} – ${endLabel}`;
};

/** Reads the device location with high accuracy; rejects with a user-facing message. */
export const getCurrentCoordinates = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Location is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }),
      (error) =>
        reject(
          new Error(
            error.code === error.PERMISSION_DENIED
              ? "Location access was denied. Allow location access to check in at the office."
              : `Could not read your location: ${error.message}`,
          ),
        ),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );
  });

/** Kapuletu schedules run on East Africa Time (UTC+3, no daylight saving). */
const EAT_OFFSET = "+03:00";

/** ISO timestamp -> "HH:mm" in EAT, for editing times regardless of the viewer's timezone. */
export const toEatTime = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        timeZone: "Africa/Nairobi",
      }).format(new Date(iso))
    : "";

/** ("2026-10-14", "08:30") -> ISO timestamp for 08:30 EAT on that date. */
export const eatDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00${EAT_OFFSET}`).toISOString();
