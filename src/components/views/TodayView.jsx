import React from "react";
import { displayDate, fromDateString, isWeekend } from "../../lib/date.js";
import { getStatusMeta } from "../../lib/status.js";

function TodayView({ people, overrides, focusDateString, onOpenAddUpdate }) {
  const focusIsWeekend = isWeekend(fromDateString(focusDateString));

  function getOverride(personId) {
    const personOverrides = overrides[personId] || {};
    return personOverrides[focusDateString] || null;
  }

  function getTodayStatusMeta(personId) {
    const overrideEntry = getOverride(personId);
    if (overrideEntry)
      return getStatusMeta(overrideEntry.status, overrideEntry.halfDayPart);

    return focusIsWeekend ? getStatusMeta("WEEKEND") : getStatusMeta("W");
  }

  return (
    <section className="content-card" aria-labelledby="today-title">
      <header className="content-card-header">
        <div className="content-card-header-row">
          <div>
            <h2 id="today-title" className="content-card-title">
              Today
            </h2>
            <p className="text-muted">{displayDate(focusDateString)}</p>
          </div>

        </div>

          <button
            type="button"
            className="primary-action-button"
            onClick={onOpenAddUpdate}
          >
            Add/Update
          </button>
      </header>

      <div className="content-card-body">
        <ul className="today-list" aria-label="Today coverage list">
          {people.map((person) => {
            const statusMeta = getTodayStatusMeta(person.id);

            return (
              <li key={person.id} className="today-list-item">
                <div>
                  <div className="today-person-name">{person.name}</div>
                  <div className="text-muted text-small">{person.role}</div>
                </div>

                <span
                  className={`grid-status-pill ${statusMeta.pillClassName}`}
                >
                  {statusMeta.shortLabel}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TodayView;
