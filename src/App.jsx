import { useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import SearchFilterPanel from "./components/SearchFilterPanel.jsx";
import TeamStatsPanel from "./components/TeamStatsPanel.jsx";
import TodayView from "./components/views/TodayView.jsx";
import IterationView from "./components/views/IterationView.jsx";
import MonthView from "./components/views/MonthView.jsx";
import EditForm from "./components/EditForm.jsx";
import Modal from "./components/Modal.jsx";
import PeopleManagerModal from "./components/PeopleManagerModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";

import { useAppState } from "./app/useAppState.js";
import { getRoleOptions, filterPeople } from "./lib/filters.js";
import { getIterationInfo } from "./lib/iteration.js";
import {
  toDateString,
  getCurrentYearMonth,
  getNextWorkingDateString,
  buildMonthRange,
} from "./lib/date.js";

const storageKey = "holiday-tracker-data-v2";

function App() {
  const [activeView, setActiveView] = useState("today");

  const [nameSearchText, setNameSearchText] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isPeopleOpen, setIsPeopleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [selectedYearMonth, setSelectedYearMonth] = useState(
    getCurrentYearMonth(),
  );

  function openAddUpdateModal() {
    setIsAddUpdateOpen(true);
  }

  const {
    people,
    overrides,
    settings,
    applyChange,
    setPeople,
    saveSettings,
    resetLocalData,
  } = useAppState(storageKey);

  const roleOptions = useMemo(() => getRoleOptions(people), [people]);

  const filteredPeople = useMemo(() => {
    return filterPeople(people, { nameSearchText, selectedRoleFilter });
  }, [people, nameSearchText, selectedRoleFilter]);

  const todayDateString = toDateString(new Date());

  const focusDateString = useMemo(() => {
    return getNextWorkingDateString(todayDateString);
  }, [todayDateString]);

  const monthDateRange = useMemo(() => {
    return buildMonthRange(selectedYearMonth);
  }, [selectedYearMonth]);

  const iterationInfo = useMemo(() => {
    return getIterationInfo(settings, focusDateString);
  }, [settings, focusDateString]);

  // Stats range depends on current view
  const statsDateRange = useMemo(() => {
    if (activeView === "iteration") return iterationInfo.iterationDateRange;
    if (activeView === "month") return monthDateRange;
    return [focusDateString];
  }, [
    activeView,
    iterationInfo.iterationDateRange,
    monthDateRange,
    focusDateString,
  ]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Navbar
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenPeople={() => setIsPeopleOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main id="main-content" className="page-content" tabIndex={-1}>
        <SearchFilterPanel
          nameSearchText={nameSearchText}
          onChangeNameSearchText={setNameSearchText}
          selectedRoleFilter={selectedRoleFilter}
          onChangeSelectedRoleFilter={setSelectedRoleFilter}
          roleOptions={roleOptions}
        />

        <TeamStatsPanel
          activeView={activeView}
          people={filteredPeople}
          overrides={overrides}
          focusDateString={focusDateString}
          dateRange={statsDateRange}
        />

        {activeView === "today" && (
          <TodayView
            people={filteredPeople}
            overrides={overrides}
            focusDateString={focusDateString}
            onOpenAddUpdate={openAddUpdateModal}
          />
        )}

        {activeView === "iteration" && (
          <IterationView
            people={filteredPeople}
            overrides={overrides}
            iterationLabel={iterationInfo.iterationLabel}
            iterationStartDateString={iterationInfo.iterationStartDateString}
            iterationEndDateString={iterationInfo.iterationEndDateString}
            dateRange={iterationInfo.iterationDateRange}
            onOpenAddUpdate={openAddUpdateModal}
          />
        )}

        {activeView === "month" && (
          <MonthView
            people={filteredPeople}
            overrides={overrides}
            selectedYearMonth={selectedYearMonth}
            onChangeYearMonth={setSelectedYearMonth}
            onOpenAddUpdate={openAddUpdateModal}
          />
        )}
      </main>

      <footer className="page-footer">
        <p className="text-muted text-small">
          Data is saved in your browser (localStorage).
        </p>
      </footer>

      <Modal
        isOpen={isAddUpdateOpen}
        title="Add/Update time off"
        onClose={() => setIsAddUpdateOpen(false)}
      >
        <EditForm people={people} onApplyChange={applyChange} />
      </Modal>

      <Modal
        isOpen={isPeopleOpen}
        title="People"
        onClose={() => setIsPeopleOpen(false)}
      >
        <PeopleManagerModal
          people={people}
          roleOptions={roleOptions}
          onPeopleChange={setPeople}
        />
      </Modal>

      <Modal
        isOpen={isSettingsOpen}
        title="Settings"
        onClose={() => setIsSettingsOpen(false)}
      >
        <SettingsModal
          settings={settings}
          onSaveSettings={saveSettings}
          onResetData={resetLocalData}
        />
      </Modal>
    </>
  );
}

export default App;

