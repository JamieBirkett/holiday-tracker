import React, { useMemo, useState } from "react";

function PeopleManager({ people, roleOptions, onPeopleChange }) {
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonRole, setNewPersonRole] = useState("");
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const sortedPeople = useMemo(() => {
    return [...people].sort((a, b) => a.name.localeCompare(b.name));
  }, [people]);

  function generateId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
      return crypto.randomUUID();
    return `person-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function handleAddPerson(event) {
    event.preventDefault();
    setStatusMessage("");

    const name = newPersonName.trim();
    const role = newPersonRole.trim();

    if (!name) {
      setStatusMessage("Please enter a name.");
      return;
    }

    onPeopleChange([
      ...people,
      { id: generateId(), name, role: role || "Unassigned" },
    ]);
    setNewPersonName("");
    setNewPersonRole("");
    setStatusMessage("Person added.");
  }

  function startEditing(person) {
    setEditingPersonId(person.id);
    setEditName(person.name);
    setEditRole(person.role || "");
  }

  function cancelEditing() {
    setEditingPersonId(null);
    setEditName("");
    setEditRole("");
    setStatusMessage("Edit cancelled.");
  }

  function saveEditing(personId) {
    const name = editName.trim();
    const role = editRole.trim();

    if (!name) {
      setStatusMessage("Name cannot be empty.");
      return;
    }

    const nextPeople = people.map((person) =>
      person.id === personId
        ? { ...person, name, role: role || "Unassigned" }
        : person,
    );

    onPeopleChange(nextPeople);
    setEditingPersonId(null);
    setStatusMessage("Person updated.");
  }

  function removePerson(personId) {
    const personToRemove = people.find((person) => person.id === personId);
    if (!window.confirm(`Remove ${personToRemove?.name || "this person"}?`))
      return;

    onPeopleChange(people.filter((person) => person.id !== personId));
    setStatusMessage("Person removed.");
  }

  return (
    <div>
      <p className="form-message" role="status" aria-live="polite">
        {statusMessage}
      </p>

      <form className="people-form" onSubmit={handleAddPerson}>
        <div className="people-form-field">
          <label className="people-form-label" htmlFor="new-person-name">
            Name
          </label>
          <input
            id="new-person-name"
            className="people-form-input"
            type="text"
            value={newPersonName}
            onChange={(event) => setNewPersonName(event.target.value)}
            placeholder="e.g. Maria Dawson"
            autoComplete="off"
          />
        </div>

        <div className="people-form-field">
          <label className="people-form-label" htmlFor="new-person-role">
            Role
          </label>
          <input
            id="new-person-role"
            className="people-form-input"
            type="text"
            list="role-suggestions"
            value={newPersonRole}
            onChange={(event) => setNewPersonRole(event.target.value)}
            placeholder="Select or type a role"
            autoComplete="off"
          />
          <datalist id="role-suggestions">
            {roleOptions.map((roleName) => (
              <option key={roleName} value={roleName} />
            ))}
          </datalist>
        </div>

        <div className="people-form-actions">
          <button className="people-form-button" type="submit">
            Add person
          </button>
        </div>
      </form>

      <ul className="people-list" aria-label="Team members">
        {sortedPeople.map((person) => {
          const isEditing = editingPersonId === person.id;

          return (
            <li key={person.id} className="people-list-item">
              {!isEditing ? (
                <>
                  <div className="people-details">
                    <div className="people-name">{person.name}</div>
                    <div className="text-muted text-small">
                      {person.role || "Unassigned"}
                    </div>
                  </div>

                  <div className="people-actions">
                    <button
                      type="button"
                      className="people-action-button"
                      onClick={() => startEditing(person)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="people-action-button people-action-button--danger"
                      onClick={() => removePerson(person.id)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="people-edit">
                  <div className="people-edit-fields">
                    <div className="people-form-field">
                      <label
                        className="people-form-label"
                        htmlFor={`edit-name-${person.id}`}
                      >
                        Name
                      </label>
                      <input
                        id={`edit-role-${person.id}`}
                        className="people-form-input"
                        type="text"
                        list="role-suggestions"
                        value={editRole}
                        onChange={(event) => setEditRole(event.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="people-form-field">
                      <label
                        className="people-form-label"
                        htmlFor={`edit-role-${person.id}`}
                      >
                        Role
                      </label>
                      <input
                        id={`edit-role-${person.id}`}
                        className="people-form-input"
                        type="text"
                        value={editRole}
                        onChange={(event) => setEditRole(event.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="people-actions">
                    <button
                      type="button"
                      className="people-action-button"
                      onClick={() => saveEditing(person.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="people-action-button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PeopleManager;
