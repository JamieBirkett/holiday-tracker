import React, { useMemo, useState } from "react";
import { toDateString, getWeekStartMonday } from "../lib/date.js";

function SettingsModal({ settings, onSaveSettings, onResetData }) {
  const defaultAnchor = useMemo(
    () => toDateString(getWeekStartMonday(new Date())),
    [],
  );
  const [piStartAnchorDate, setPiStartAnchorDate] = useState(
    settings.piStartAnchorDate || defaultAnchor,
  );
  const [startingPiNumber, setStartingPiNumber] = useState(
    String(settings.startingPiNumber ?? 7),
  );
  const [iterationsPerPi, setIterationsPerPi] = useState(
    String(settings.iterationsPerPi ?? 6),
  );
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const parsedIterations = Number(iterationsPerPi);
    const parsedStartingPiNumber = Number(startingPiNumber);

    if (!piStartAnchorDate) {
      setMessage("Please choose a PI start anchor date.");
      return;
    }
    if (
      !Number.isFinite(parsedIterations) ||
      parsedIterations < 1 ||
      parsedIterations > 20
    ) {
      setMessage("Iterations per PI must be a number between 1 and 20.");
      return;
    }

    if (
      !Number.isFinite(parsedStartingPiNumber) ||
      parsedStartingPiNumber < 1
    ) {
      setMessage("Starting PI number must be a positive number.");
      return;
    }

    onSaveSettings({
      piStartAnchorDate,
      iterationsPerPi: parsedIterations,
      startingPiNumber: parsedStartingPiNumber,
    });

    setMessage("Settings saved.");
  }

  return (
    <div>
      <p className="form-message" role="status" aria-live="polite">
        {message}
      </p>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-field">
          <label className="settings-label" htmlFor="pi-anchor-date">
            PI start anchor (1st iteration start date)
          </label>
          <input
            id="pi-anchor-date"
            className="settings-input"
            type="date"
            value={piStartAnchorDate}
            onChange={(event) => setPiStartAnchorDate(event.target.value)}
          />
        </div>

        <div className="settings-field">
          <label className="settings-label" htmlFor="iterations-per-pi">
            Iterations per PI
          </label>
          <input
            id="iterations-per-pi"
            className="settings-input"
            type="number"
            min="1"
            max="20"
            value={iterationsPerPi}
            onChange={(event) => setIterationsPerPi(event.target.value)}
          />
        </div>

        <div className="settings-field">
          <label className="settings-label" htmlFor="starting-pi-number">
            Starting PI number
          </label>
          <input
            id="starting-pi-number"
            className="settings-input"
            type="number"
            min="1"
            max="999"
            value={startingPiNumber}
            onChange={(event) => setStartingPiNumber(event.target.value)}
          />
        </div>

        <div className="settings-actions">
          <button type="submit" className="primary-action-button">
            Save settings
          </button>
          <button
            type="button"
            className="secondary-action-button"
            onClick={onResetData}
          >
            Reset local data
          </button>
        </div>
      </form>

      <p className="text-muted text-small" style={{ marginTop: 10 }}>
        Reset will remove local people + holidays from this browser only.
      </p>
    </div>
  );
}

export default SettingsModal;
