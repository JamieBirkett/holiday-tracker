import { buildIterationRangeFromAnchor } from "./date.js";

export function getIterationInfo(settings, focusDateString) {
  const piStartAnchorDate = settings?.piStartAnchorDate || focusDateString;

  const iterationsPerPi = Number(settings?.iterationsPerPi) || 6;
  const startingPiNumber = Number(settings?.startingPiNumber) || 7;

  const {
    iterationIndex,
    iterationStartDateString,
    iterationEndDateString,
    iterationDateRange,
  } = buildIterationRangeFromAnchor(piStartAnchorDate, focusDateString);

  const piNumber =
    startingPiNumber + Math.floor(iterationIndex / iterationsPerPi);
  const iterationWithinPi = (iterationIndex % iterationsPerPi) + 1;

  const isPlanningIteration = iterationWithinPi === iterationsPerPi;

  const iterationLabel = isPlanningIteration
    ? `${piNumber}.${iterationWithinPi} (PI Planning)`
    : `${piNumber}.${iterationWithinPi}`;

  return {
    iterationStartDateString,
    iterationEndDateString,
    iterationDateRange,
    iterationLabel,
  };
}
