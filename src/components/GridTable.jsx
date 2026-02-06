import React from "react";
import {
  fromDateString,
  getWeekdayShortName,
  isWeekend,
  displayDate,
} from "../lib/date.js";
import { getStatusMeta } from "../lib/status.js";

/**
 * Purpose: Reusable grid table (people rows x day columns).
 * Inputs:
 * - dateRange: array of "YYYY-MM-DD" strings
 * - overrides: { [personId]: { [dateString]: { status, halfDayPart } } }
 * Output: Responsive, scrollable, accessible table
 */
function GridTable({ people, dateRange, overrides, ariaLabel }) {
  function getOverride(personId, dateString) {
    const personOverrides = overrides[personId] || {};
    return personOverrides[dateString] || null;
  }

  return (
    <div
      className="grid-table-container"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <table className="grid-table">
        <thead>
          <tr>
            <th
              scope="col"
              className="grid-table-header-cell grid-table-sticky-column"
            >
              Person
            </th>

            {dateRange.map((dateString) => {
              const date = fromDateString(dateString);
              const weekdayLabel = getWeekdayShortName(date);
              const dayOfMonth = date.getDate();

              return (
                <th
                  scope="col"
                  key={dateString}
                  className="grid-table-header-cell"
                  title={displayDate(dateString)}
                >
                  <div>{weekdayLabel}</div>
                  <div className="text-muted text-small">{dayOfMonth}</div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <th
                scope="row"
                className="grid-table-person-cell grid-table-sticky-column"
              >
                <div className="grid-person-name">{person.name}</div>
                <div className="text-muted text-small">{person.role}</div>
              </th>

              {dateRange.map((dateString) => {
                const date = fromDateString(dateString);
                const weekend = isWeekend(date);
                const overrideEntry = getOverride(person.id, dateString);

                if (weekend) {
                  return (
                    <td
                      key={dateString}
                      className="grid-table-weekend-cell"
                      aria-label={`${person.name} on ${displayDate(dateString)}: Weekend`}
                    >
              
                    </td>
                  );
                }

                const statusValue = overrideEntry?.status ?? "W";
                const halfDayPart = overrideEntry?.halfDayPart ?? null;

                const statusMeta = getStatusMeta(statusValue, halfDayPart);

                return (
                  <td
                    key={dateString}
                    className={weekend ? "grid-table-weekend-cell" : "grid-table-weekday-cell"}
                  >
                    <span
                      className={`grid-status-pill ${statusMeta.pillClassName}`}
                      aria-label={`${person.name} on ${displayDate(dateString)}: ${statusMeta.label}`}
                    >
                      {statusMeta.shortLabel}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GridTable;
