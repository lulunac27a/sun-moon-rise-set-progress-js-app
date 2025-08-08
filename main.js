import readline from "readline";
import SunCalc from "suncalc";
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

input.question("Enter latitude: ", (latitudeInput) => {
  const latitude = parseFloat(latitudeInput);
  input.question("Enter longitude: ", (longitudeInput) => {
    const longitude = parseFloat(longitudeInput);
    const dateNow = new Date();
    const dayBeforeYesterday = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() - 2,
    );
    const yesterday = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() - 1,
    );
    const today = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth,
      dateNow.getDate(),
    );
    const tomorrow = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() + 1,
    );
    const dayAfterTomorrow = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() + 2,
    );
    const dates = [
      dayBeforeYesterday,
      yesterday,
      today,
      tomorrow,
      dayAfterTomorrow,
    ];
    const events = [];
    let previousMoonEvent = null,
      nextMoonEvent = null;
    for (const dateEvent of dates) {
      const times = SunCalc.getMoonTimes(dateEvent, latitude, longitude);
      if (times.rise != null || times.rise !== undefined) {
        events.push({ type: "rise", date: times.rise });
      }
      if (times.set != null || times.set !== undefined) {
        events.push({ type: "set", date: times.set });
      }
      events.sort((a, b) => a.date - b.date);
      const previous = [...events].reverse().find((e) => e.date < dateNow);
      const next = events.find((e) => e.date > dateNow);
      previousMoonEvent = previous;
      nextMoonEvent = next;
    }
    const times = SunCalc.getTimes(dateNow, latitude, longitude);
    const previousDayTimes = SunCalc.getTimes(
      dateNow.setDate(dateNow.getDate() - 1),
      latitude,
      longitude,
    );
    const nextDayTimes = SunCalc.getTimes(
      dateNow.setDate(dateNow.getDate() + 1),
      latitude,
      longitude,
    );
    const moonTimes = SunCalc.getMoonTimes(dateNow, latitude, longitude);
    const sunrise = times.sunrise;
    const nextDaySunrise = nextDayTimes.sunrise;
    const previousDaySunset = previousDayTimes.sunset;
    const sunset = times.sunset;
    let previousSunriseSet = null,
      nextSunriseSet = null;
    const moonrise = moonTimes.rise;
    const moonset = moonTimes.set;
    let isSunUp = false;
    let isMoonUp = false;
    if (dateNow > sunrise && dateNow < sunset) {
      previousSunriseSet = sunrise;
      nextSunriseSet = sunset;
      isSunUp = true;
    } else if (dateNow > sunset && dateNow < nextDaySunrise) {
      previousSunriseSet = sunset;
      nextSunriseSet = nextDaySunrise;
      isSunUp = false;
    } else if (dateNow > previousDaySunset && dateNow < sunrise) {
      previousSunriseSet = previousDaySunset;
      nextSunriseSet = sunrise;
      isSunUp = false;
    }
    if (previousMoonEvent.type === "rise") {
      isMoonUp = true;
    } else if (previousMoonEvent.type === "set") {
      isMoonUp = false;
    }
    console.log("Sunrise: " + sunrise + " Sunset: " + sunset);
    console.log("Moonrise: " + moonrise + " Moonset: " + moonset);
    console.log("Previous Sunrise/Sunset: " + previousSunriseSet);
    console.log("Next Sunrise/Sunset: " + nextSunriseSet);
    console.log("Previous Moonrise/Moonset: " + previousMoonEvent.date);
    console.log("Next Moonrise/Moonset: " + nextMoonEvent.date);
    const sunProgress =
      (dateNow - previousSunriseSet) / (nextSunriseSet - previousSunriseSet);
    const moonProgress =
      (dateNow - previousMoonEvent.date) /
      (nextMoonEvent.date - previousMoonEvent.date);
    console.log(
      "Sun progress from " +
        (isSunUp ? "sunrise to sunset: " : "sunset to sunrise: ") +
        (sunProgress * 100).toFixed(2) +
        "%",
    );
    console.log(
      "Moon progress from " +
        (isMoonUp ? "moonrise to moonset: " : "moonset to moonrise: ") +
        (moonProgress * 100).toFixed(2) +
        "%",
    );
    input.close();
  });
});
