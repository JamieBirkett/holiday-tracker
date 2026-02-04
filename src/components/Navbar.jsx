import React from "react";

/**
 * Purpose: Top navigation bar.
 * Output: App branding + People/Settings buttons (modals).
 */
function Navbar({ activeView, onChangeView, onOpenPeople, onOpenSettings }) {
  const viewOptions = [
    { viewId: "today", label: "Today" },
    { viewId: "iteration", label: "Iteration" },
    { viewId: "month", label: "Month" },
  ];

  return (
    <header className="header">
      <div className="container header-layout">
        {/* Left: Branding */}
        <div className="header-brand" aria-label="Holiday Tracker">
          <div className="headermark" aria-hidden="true" />
          <div>
            <h1 className="header-title">Holiday Tracker</h1>
            <p className="header-subtitle">
              Team coverage during PI iterations
            </p>
          </div>
        </div>

        {/* Center: Views */}
        <nav className="nav-views" aria-label="Views">
          <div className="view-tabs">
            {viewOptions.map((viewOption) => (
              <button
                key={viewOption.viewId}
                type="button"
                className="view-tab-button"
                aria-current={
                  activeView === viewOption.viewId ? "page" : undefined
                }
                onClick={() => onChangeView(viewOption.viewId)}
              >
                {viewOption.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Right: People / Settings */}
        <nav className="nav-tools" aria-label="Tools">
          <button
            type="button"
            className="tool-button"
            onClick={onOpenPeople}
            aria-label="Open People manager"
          >
            People
          </button>

          <button
            type="button"
            className="tool-button"
            onClick={onOpenSettings}
            aria-label="Open Settings"
          >
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
