/**
 * Purpose: Minimal date helpers for Holiday Tracker.
 * Internal date string format: "YYYY-MM-DD" (works with native date inputs and sorting)
 * Display format: "DD-MM-YYYY"
 */

export function toDateString(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function displayDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function addDays(dateValue, numberOfDays) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + numberOfDays);
  return date;
}

export function getWeekdayShortName(dateValue) {
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdayNames[new Date(dateValue).getDay()];
}

export function isWeekend(dateValue) {
  const dayIndex = new Date(dateValue).getDay();
  return dayIndex === 0 || dayIndex === 6;
}

/**
 * Output: Monday of the week that contains dateValue.
 */
export function getWeekStartMonday(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);

  const dayIndex = date.getDay(); // 0=Sun, 1=Mon...
  const daysToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;

  return addDays(date, daysToMonday);
}

/**
 * Output: array of date strings for a 14-day iteration starting from iterationStartDate.
 */
export function buildTwoWeekRange(iterationStartDate) {
  return Array.from({ length: 14 }, (_, dayOffset) =>
    toDateString(addDays(iterationStartDate, dayOffset)),
  );
}

/**
 * Output: "YYYY-MM" for <input type="month">.
 */
export function getCurrentYearMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Output: array of date strings for every day in the month provided ("YYYY-MM").
 */
export function buildMonthRange(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const dateStrings = [];
  for (
    let currentDate = new Date(firstDayOfMonth);
    currentDate <= lastDayOfMonth;
    currentDate = addDays(currentDate, 1)
  ) {
    dateStrings.push(toDateString(currentDate));
  }

  return dateStrings;
}

export function buildDateRange(startDateString, endDateString) {
  const startDate = fromDateString(startDateString);
  const endDate = fromDateString(endDateString);

  const rangeStart = startDate <= endDate ? startDate : endDate;
  const rangeEnd = startDate <= endDate ? endDate : startDate;

  const dateStrings = [];
  for (
    let currentDate = new Date(rangeStart);
    currentDate <= rangeEnd;
    currentDate = addDays(currentDate, 1)
  ) {
    dateStrings.push(toDateString(currentDate));
  }

  return dateStrings;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function getNextWorkingDateString(dateString) {
  let currentDate = fromDateString(dateString);

  while (isWeekend(currentDate)) {
    currentDate = addDays(currentDate, 1);
  }

  return toDateString(currentDate);
}

export function addDaysToDateString(dateString, numberOfDays) {
  return toDateString(addDays(fromDateString(dateString), numberOfDays));
}

export function getDayDifference(startDateString, endDateString) {
  const startDate = fromDateString(startDateString);
  const endDate = fromDateString(endDateString);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );
}

export function buildIterationRangeFromAnchor(
  anchorStartDateString,
  currentDateString,
) {
  const dayDifference = getDayDifference(
    anchorStartDateString,
    currentDateString,
  );
  const iterationIndex = Math.floor(dayDifference / 14);

  const iterationStartDateString = addDaysToDateString(
    anchorStartDateString,
    iterationIndex * 14,
  );
  const iterationDateRange = buildTwoWeekRange(
    fromDateString(iterationStartDateString),
  );
  const iterationEndDateString =
    iterationDateRange[iterationDateRange.length - 1];

  return {
    iterationIndex,
    iterationStartDateString,
    iterationEndDateString,
    iterationDateRange,
  };
}
