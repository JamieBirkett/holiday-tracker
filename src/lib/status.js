export const statusOptions = [
  { value: "DEFAULT", label: "Default (clear override)" },
  { value: "W", label: "Working" },
  { value: "H", label: "Holiday" },
  { value: "HALF", label: "Half-day holiday" },
  { value: "BH", label: "Bank Holiday" },
  { value: "NWD", label: "Non-working day" },
];

export function getStatusMeta(statusValue, halfDayPart) {
  switch (statusValue) {
    case "H":
      return {
        label: "Holiday",
        shortLabel: "H",
        pillClassName: "grid-status-pill-holiday",
      };
    case "BH":
      return {
        label: "Bank Holiday",
        shortLabel: "BH",
        pillClassName: "grid-status-pill-bankholiday",
      };
    case "NWD":
      return {
        label: "Non-working day",
        shortLabel: "NWD",
        pillClassName: "grid-status-pill-nonworking",
      };
    case "PI":
      return {
        label: "PI (working)",
        shortLabel: "PI",
        pillClassName: "grid-status-pill-working",
      };
    case "HALF":
      return {
        label: "Half-day holiday",
        shortLabel: halfDayPart ? halfDayPart : "HALF",
        pillClassName: "grid-status-pill-halfday",
      };
    case "WEEKEND":
      return {
        label: "Weekend",
        shortLabel: "WKND",
        pillClassName: "grid-status-pill-weekend",
      };
    case "W":
    default:
      return {
        label: "Working",
        shortLabel: "W",
        pillClassName: "grid-status-pill-sworking",
      };
  }
}
