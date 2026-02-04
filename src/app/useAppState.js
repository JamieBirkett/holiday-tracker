import { useLocalStorage } from "../lib/useLocalStorage.js";
import { samplePeople } from "../lib/sampleData.js";
import { toDateString } from "../lib/date.js";

const defaultSettings = {
  piStartAnchorDate: toDateString(new Date()),
  iterationsPerPi: 6,
  startingPiNumber: 7,
};

const defaultData = {
  people: samplePeople,
  overrides: {},
  settings: defaultSettings,
};

function cloneValue(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

export function useAppState(storageKey) {
  const [appData, setAppData] = useLocalStorage(storageKey, defaultData);

  function applyChange(personId, dateRange, changePayload) {
    setAppData((currentData) => {
      const nextData = cloneValue(currentData);

      nextData.overrides[personId] = nextData.overrides[personId] || {};

      for (const dateString of dateRange) {
        if (changePayload.status === "DEFAULT") {
          delete nextData.overrides[personId][dateString];
        } else {
          nextData.overrides[personId][dateString] = {
            status: changePayload.status,
            halfDayPart: changePayload.halfDayPart || null,
          };
        }
      }

      return nextData;
    });
  }

  function setPeople(nextPeople) {
    setAppData((currentData) => {
      const nextData = cloneValue(currentData);
      nextData.people = nextPeople;

      // Remove overrides for deleted people
      const validPersonIds = new Set(nextPeople.map((person) => person.id));
      for (const personId of Object.keys(nextData.overrides)) {
        if (!validPersonIds.has(personId)) {
          delete nextData.overrides[personId];
        }
      }

      return nextData;
    });
  }

  function saveSettings(nextSettings) {
    setAppData((currentData) => {
      const nextData = cloneValue(currentData);
      nextData.settings = { ...nextData.settings, ...nextSettings };
      return nextData;
    });
  }

  function resetLocalData() {
    localStorage.removeItem(storageKey);
    window.location.reload();
  }

  return {
    people: appData.people,
    overrides: appData.overrides,
    settings: appData.settings,
    applyChange,
    setPeople,
    saveSettings,
    resetLocalData,
  };
}
