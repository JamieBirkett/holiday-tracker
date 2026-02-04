import React, { useMemo, useState } from "react";
import { toDateString, buildDateRange } from "../lib/date.js";
import { statusOptions } from "../lib/status.js";

/**
 * Purpose: Apply statuses via a form (person + date range + status + optional half-day).
 * Output: Calls onApplyChange(personId, dateRange, changePayload)
 */
function EditForm({ people, onApplyChange }) {
  const todayDateString = useMemo(() => toDateString(new Date()), []);
  const [selectedPersonId, setSelectedPersonId] = useState(people[0]?.id || "");
  const [startDate, setStartDate] = useState(todayDateString);
  const [endDate, setEndDate] = useState(todayDateString);
  const [selectedStatus, setSelectedStatus] = useState("H");
  const [halfDayPart, setHalfDayPart] = useState("AM");
  const [errorMessage, setErrorMessage] = useState("");

  const showHalfDaySelector = selectedStatus === "HALF";

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedPersonId) {
      setErrorMessage("Please choose a person.");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please choose a start and end date.");
      return;
    }

    const dateRange = buildDateRange(startDate, endDate);

    onApplyChange(selectedPersonId, dateRange, {
      status: selectedStatus,
      halfDayPart: showHalfDaySelector ? halfDayPart : null,
    });
  }

  return (
    <section className="content-card" aria-labelledby="edit-form-title">
      <header className="content-card-header">
        <h2 id="edit-form-title" className="content-card-title">
          Add / Update
        </h2>
        <p className="text-muted">Apply a status across a date range</p>
      </header>

      <div className="content-card-body">
        <p className="form-message" role="status" aria-live="polite">
          {errorMessage}
        </p>

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="edit-form-field">
            <label className="edit-form-label" htmlFor="person-select">
              Person
            </label>
            <select
              id="person-select"
              className="edit-form-input"
              value={selectedPersonId}
              onChange={(event) => setSelectedPersonId(event.target.value)}
            >
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-form-field">
            <label className="edit-form-label" htmlFor="status-select">
              Status
            </label>
            <select
              id="status-select"
              className="edit-form-input"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showHalfDaySelector && (
            <div className="edit-form-field">
              <label className="edit-form-label" htmlFor="halfday-select">
                Half-day
              </label>
              <select
                id="halfday-select"
                className="edit-form-input"
                value={halfDayPart}
                onChange={(event) => setHalfDayPart(event.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          )}

          <div className="edit-form-field">
            <label className="edit-form-label" htmlFor="start-date">
              Start
            </label>
            <input
              id="start-date"
              className="edit-form-input"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="edit-form-field">
            <label className="edit-form-label" htmlFor="end-date">
              End
            </label>
            <input
              id="end-date"
              className="edit-form-input"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <div className="edit-form-actions">
            <button className="edit-form-button" type="submit">
              Apply
            </button>
          </div>
        </form>

        <p className="text-muted text-small" style={{ marginTop: 10 }}>
          Tip: Use <strong>Default (clear override)</strong> to remove custom
          entries and return to the default behaviour.
        </p>
      </div>
    </section>
  );
}

export default EditForm;
