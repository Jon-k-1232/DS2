import dayjs from 'dayjs';

// Used for professional legal services for billing by 6 minute increments.
export const sixMinuteIncrementTimeCalculation = (startTime, endTime, userInputMinutes) => {
  const mins = userInputMinutes ? Number(userInputMinutes) : endTime.diff(startTime, 'minutes', true);
  const totalHours = parseInt(mins / 60);
  const manualMinutes = userInputMinutes < 60 ? mins : mins - Math.floor(totalHours) * 60;
  // Truthy is for user manually inputting minutes vs time clock times.
  const totalMins = userInputMinutes ? manualMinutes : dayjs().minute(mins).$m + 1;
  let total = 0;

  switch (true) {
    case totalMins >= 0 && totalMins <= 6:
      total = `${totalHours}.1`;
      break;
    case totalMins >= 7 && totalMins <= 12:
      total = `${totalHours}.2`;
      break;
    case totalMins >= 13 && totalMins <= 18:
      total = `${totalHours}.3`;
      break;
    case totalMins >= 19 && totalMins <= 24:
      total = `${totalHours}.4`;
      break;
    case totalMins >= 25 && totalMins <= 30:
      total = `${totalHours}.5`;
      break;
    case totalMins >= 31 && totalMins <= 36:
      total = `${totalHours}.6`;
      break;
    case totalMins >= 37 && totalMins <= 42:
      total = `${totalHours}.7`;
      break;
    case totalMins >= 43 && totalMins <= 48:
      total = `${totalHours}.8`;
      break;
    case totalMins >= 49 && totalMins <= 54:
      total = `${totalHours}.9`;
      break;
    case totalMins >= 55 && totalMins <= 60:
      total = `${totalHours + 1}.0`;
      break;
    default:
      console.log('error caught at handleTimeCalculation()');
  }

  return total;
};
