import React, { useMemo } from "react";
import { displayDate } from "../lib/date.js";
import {
  calculateDayAvailability,
  calculateRangeAvailability,
} from "../lib/coverage.js";


function TeamStatsPanel({
  activeView,
  people,
  overrides,
  focusDateString,
  dateRange,
}) {
  const isRangeView = activeView === "iteration" || activeView === "month";

  const dayStats = useMemo(() => {
    return calculateDayAvailability(people, overrides, focusDateString);
  }, [people, overrides, focusDateString]);

  const rangeStats = useMemo(() => {
    return isRangeView
      ? calculateRangeAvailability(people, overrides, dateRange)
      : null;
  }, [isRangeView, people, overrides, dateRange]);

  return (
    <section className="content-card" aria-labelledby="team-stats-title">
      <header className="content-card-header">
        <div className="content-card-header-row">
        <h2 id="team-stats-title" className="content-card-title">
          Team stats
        </h2>
        <p className="text-muted">
          Team coverage during the selected range
        </p>
        </div>
      </header>

      <div className="content-card-body">
        <div className="team-info-row">
          <div className="team-stats">
            <div className="team-stat">
              <div className="team-stat-label">Focus date</div>
              <div className="team-stat-value">
                {displayDate(focusDateString)}
              </div>
            </div>

            <div className="team-stat">
              <div className="team-stat-label">Working</div>
              <div className="team-stat-value">
                {dayStats.isWeekend
                  ? "Weekend"
                  : `${dayStats.workingUnits.toFixed(1)} / ${people.length}`}
              </div>
            </div>

            {isRangeView && rangeStats && (
              <>
                <div className="team-stat">
                  <div className="team-stat-label">Avg working</div>
                  <div className="team-stat-value">
                    {rangeStats.weekdayCount === 0
                      ? "No weekdays"
                      : `${rangeStats.averageWorkingUnits.toFixed(1)} / ${people.length}`}
                  </div>
                </div>

                <div className="team-stat">
                  <div className="team-stat-label">Lowest day in range</div>
                  <div className="team-stat-value">
                    {rangeStats.lowestWorkingDateString
                      ? `${rangeStats.lowestWorkingUnits.toFixed(1)} on ${displayDate(rangeStats.lowestWorkingDateString)}`
                      : "—"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="role-availability">
          <h3 className="role-availability-title">Role availability</h3>

          {activeView === "today" ? (
            <ul
              className="role-availability-list"
              aria-label="Role availability for focus date"
            >
              {Object.entries(dayStats.roleStats)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([roleName, stat]) => (
                  <li key={roleName} className="role-availability-item">
                    <span className="role-name">{roleName}</span>
                    <span className="role-value">
                      {stat.workingUnits.toFixed(1)} / {stat.totalPeople}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <ul
              className="role-availability-list"
              aria-label="Average role availability for date range"
            >
              {rangeStats &&
                Object.entries(rangeStats.roleAverages)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([roleName, stat]) => (
                    <li key={roleName} className="role-availability-item">
                      <span className="role-name">{roleName}</span>
                      <span className="role-value">
                        {stat.averageWorkingUnits.toFixed(1)} /{" "}
                        {stat.totalPeople}
                      </span>
                    </li>
                  ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default TeamStatsPanel;
