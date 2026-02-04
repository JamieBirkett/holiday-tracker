import { fromDateString, isWeekend } from "./date.js";

function getOverride(overrides, personId, dateString) {
  const personOverrides = overrides[personId] || {};
  return personOverrides[dateString] || null;
}

function getWorkingUnitsForStatus(statusValue) {
  // PI counts as working
  if (statusValue === "W" || statusValue === "PI") return 1;
  if (statusValue === "HALF") return 0.5;
  return 0;
}

/**
 * Purpose: Calculate working availability for a single date (weekday only).
 * Output: workingUnits + per-role totals (weekends return isWeekend: true).
 */

export function calculateDayAvailability(people, overrides, dateString) {
  const weekend = isWeekend(fromDateString(dateString));
  if (weekend) {
    return {
      isWeekend: true,
      totalPeople: people.length,
      workingUnits: 0,
      roleStats: {},
    };
  }

  const roleStats = {};
  let workingUnits = 0;

  for (const person of people) {
    const roleName = (person.role || "Unassigned").trim() || "Unassigned";

    if (!roleStats[roleName]) {
      roleStats[roleName] = { totalPeople: 0, workingUnits: 0 };
    }

    roleStats[roleName].totalPeople += 1;

    const overrideEntry = getOverride(overrides, person.id, dateString);
    const statusValue = overrideEntry?.status ?? "W";
    const personWorkingUnits = getWorkingUnitsForStatus(statusValue);

    roleStats[roleName].workingUnits += personWorkingUnits;
    workingUnits += personWorkingUnits;
  }

  return {
    isWeekend: false,
    totalPeople: people.length,
    workingUnits,
    roleStats,
  };
}

/**
 * Purpose: Calculate working availability for a date range (weekdays only).
 * Output: average, lowest day, and per-role averages for the range.
 */

export function calculateRangeAvailability(people, overrides, dateRange) {
  const weekdayDates = dateRange.filter(
    (dateString) => !isWeekend(fromDateString(dateString)),
  );
  const weekdayCount = weekdayDates.length;

  if (weekdayCount === 0) {
    return {
      weekdayCount: 0,
      averageWorkingUnits: 0,
      lowestWorkingUnits: 0,
      lowestWorkingDateString: null,
      roleAverages: {},
    };
  }

  let totalWorkingUnits = 0;
  let lowestWorkingUnits = Number.POSITIVE_INFINITY;
  let lowestWorkingDateString = null;

  const roleTotals = {}; // { role: { totalPeople, workingUnitsTotal } }

  for (const dateString of weekdayDates) {
    const dayStats = calculateDayAvailability(people, overrides, dateString);
    totalWorkingUnits += dayStats.workingUnits;

    if (dayStats.workingUnits < lowestWorkingUnits) {
      lowestWorkingUnits = dayStats.workingUnits;
      lowestWorkingDateString = dateString;
    }

    for (const [roleName, roleStat] of Object.entries(dayStats.roleStats)) {
      if (!roleTotals[roleName]) {
        roleTotals[roleName] = {
          totalPeople: roleStat.totalPeople,
          workingUnitsTotal: 0,
        };
      }
      roleTotals[roleName].workingUnitsTotal += roleStat.workingUnits;
    }
  }

  const averageWorkingUnits = totalWorkingUnits / weekdayCount;

  const roleAverages = {};
  for (const [roleName, roleTotal] of Object.entries(roleTotals)) {
    roleAverages[roleName] = {
      totalPeople: roleTotal.totalPeople,
      averageWorkingUnits: roleTotal.workingUnitsTotal / weekdayCount,
    };
  }

  return {
    weekdayCount,
    averageWorkingUnits,
    lowestWorkingUnits,
    lowestWorkingDateString,
    roleAverages,
  };
}
