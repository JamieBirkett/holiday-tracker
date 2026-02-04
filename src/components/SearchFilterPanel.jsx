import React from "react";

function SearchFilterPanel({
  nameSearchText,
  onChangeNameSearchText,
  selectedRoleFilter,
  onChangeSelectedRoleFilter,
  roleOptions,
}) {
  return (
    <section className="content-card" aria-labelledby="search-filter-title">
      <header className="content-card-header">
        <h2 id="search-filter-title" className="content-card-title">
          Search & Filters
        </h2>
        <p className="text-muted">Search by name and filter by role</p>
      </header>

      <div className="content-card-body">
        <div className="search-filter-grid">
          <div className="search-field">
            <label className="search-label" htmlFor="name-search-input">
              Name
            </label>
            <input
              id="name-search-input"
              className="search-input"
              type="text"
              value={nameSearchText}
              onChange={(event) => onChangeNameSearchText(event.target.value)}
              placeholder="e.g. Maria Dawson"
              autoComplete="off"
            />
          </div>

          <div className="search-field">
            <label className="search-label" htmlFor="role-filter-select">
              Role
            </label>
            <select
              id="role-filter-select"
              className="search-select"
              value={selectedRoleFilter}
              onChange={(event) =>
                onChangeSelectedRoleFilter(event.target.value)
              }
            >
              <option value="ALL">All roles</option>
              {roleOptions.map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TODO: Placeholder for future filters */}
        <div
          className="filters-placeholder"
          role="note"
          aria-label="Filters placeholder"
        >
          Filters coming soon (status, show only people off, etc.).
        </div>
      </div>
    </section>
  );
}

export default SearchFilterPanel;
