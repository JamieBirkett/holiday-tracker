import React, { useMemo } from "react";
import GridTable from "../GridTable.jsx";
import { buildMonthRange } from "../../lib/date.js";

function MonthView({
  people,
  overrides,
  selectedYearMonth,
  onChangeYearMonth,
  onOpenAddUpdate,
}) {
  const dateRange = useMemo(
    () => buildMonthRange(selectedYearMonth),
    [selectedYearMonth],
  );

  return (
    <section className="content-card" aria-labelledby="month-title">
      <header className="content-card-header">
        <div className="content-card-header-row">
          <div>
            <h2 id="month-title" className="content-card-title">
              Month
            </h2>
            <p className="text-muted">View coverage for a full month</p>
          </div>

          <button
            type="button"
            className="primary-action-button"
            onClick={onOpenAddUpdate}
          >
            Add/Update
          </button>
        </div>
      </header>

      <div className="content-card-body">
        <div className="month-controls" aria-label="Month controls">
          <label className="month-controls-label" htmlFor="month-picker">
            Choose month
          </label>
          <input
            id="month-picker"
            className="month-controls-input"
            type="month"
            value={selectedYearMonth}
            onChange={(event) => onChangeYearMonth(event.target.value)}
          />
        </div>

        <GridTable
          people={people}
          dateRange={dateRange}
          overrides={overrides}
          ariaLabel="Month holiday grid table"
        />
      </div>
    </section>
  );
}

export default MonthView;
