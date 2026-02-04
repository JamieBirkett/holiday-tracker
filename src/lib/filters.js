
export function getRoleOptions(people) {
  const roleMap = new Map(); // lowercased -> display label

  for (const person of people) {
    const roleText = (person.role || "").trim();
    if (!roleText) continue;

    const key = roleText.toLowerCase();
    if (!roleMap.has(key)) roleMap.set(key, roleText);
  }

  return Array.from(roleMap.values()).sort((a, b) => a.localeCompare(b));
}

export function filterPeople(people, { nameSearchText, selectedRoleFilter }) {
  const nameQuery = (nameSearchText || "").trim().toLowerCase();
  const roleFilter = selectedRoleFilter || "ALL";

  return people.filter((person) => {
    const personName = (person.name || "").toLowerCase();
    const personRole = (person.role || "").trim();

    const matchesName = !nameQuery || personName.includes(nameQuery);
    const matchesRole = roleFilter === "ALL" || personRole === roleFilter;

    return matchesName && matchesRole;
  });
}
