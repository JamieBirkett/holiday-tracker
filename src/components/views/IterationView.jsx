import React from "react";
import GridTable from "../GridTable.jsx";
import { displayDate } from "../../lib/date.js";

function IterationView({
  people,
  overrides,
  iterationLabel,
  iterationStartDateString,
  iterationEndDateString,
  dateRange,
  onOpenAddUpdate,
}) {
  return (
    <section className="content-card" aria-labelledby="iteration-title">
      <header className="content-card-header">
        <div className="content-card-header-row">
          <div>
            <h2 id="iteration-title" className="content-card-title">
              Iteration {iterationLabel}
            </h2>
            <p className="text-muted">
              {displayDate(iterationStartDateString)} {" to "}
              {displayDate(iterationEndDateString)}
            </p>
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
        <GridTable
          people={people}
          dateRange={dateRange}
          overrides={overrides}
          ariaLabel="Iteration holiday grid table"
        />
      </div>
    </section>
  );
}

export default IterationView;
