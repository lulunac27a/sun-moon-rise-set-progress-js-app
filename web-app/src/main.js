import suncalc from "suncalc";
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const sunriseOutput = document.getElementById("sunrise");
const sunsetOutput = document.getElementById("sunset");
const moonriseOutput = document.getElementById("moonrise");
const moonsetOutput = document.getElementById("moonset");
const sunStartTimeOutput = document.getElementById("sun-start-time");
const sunEndTimeOutput = document.getElementById("sun-end-time");
const sunProgressOutput = document.getElementById("sun-progress");
const moonStartTimeOutput = document.getElementById("moon-start-time");
const moonEndTimeOutput = document.getElementById("moon-end-time");
const moonProgressOutput = document.getElementById("moon-progress");
function calculate() {
    const dateNow = new Date();
    const moonEvents = [];
    let previousMoonEvent = null;
    let nextMoonEvent = null;
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);
    const previousDayTimes = suncalc.getTimes(
        new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 1,
        ),
        latitude,
        longitude,
    );
    const times = suncalc.getTimes(dateNow, latitude, longitude);
    const nextDayTimes = suncalc.getTimes(
        new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() + 1,
        ),
        latitude,
        longitude,
    );
    const moonTimes = suncalc.getMoonTimes(dateNow, latitude, longitude);
    const sunrise = times.sunrise;
    const sunset = times.sunset;
    const moonrise = moonTimes.rise;
    const moonset = moonTimes.set;
    let isSunUp = false;
    let isMoonUp = false;
    let previousSunriseSet = null;
    let nextSunriseSet = null;
    if (dateNow > sunrise && dateNow < sunset) {
        isSunUp = true;
        previousSunriseSet = times.sunrise;
        nextSunriseSet = times.sunset;
    } else if (dateNow > sunset && dateNow < nextDayTimes.sunrise) {
        isSunUp = false;
        previousSunriseSet = times.sunset;
        nextSunriseSet = nextDayTimes.sunrise;
    } else if (dateNow > previousDayTimes.sunset && dateNow < sunrise) {
        isSunUp = false;
        previousSunriseSet = previousDayTimes.sunset;
        nextSunriseSet = times.sunrise;
    }
    for (let i = -2; i <= 2; i++) {
        let dateEvent = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() + i,
        );
        let times = suncalc.getMoonTimes(
            dateEvent,
            latitudeInput.value,
            longitudeInput.value,
        );
        if (times.rise) {
            moonEvents.push({ type: "rise", date: times.rise });
        }
        if (times.set) {
            moonEvents.push({ type: "set", date: times.set });
        }
    }
    moonEvents.sort((a, b) => a.date - b.date);
    previousMoonEvent = [...moonEvents].reverse().find((e) => e.date < dateNow);
    nextMoonEvent = moonEvents.find((e) => e.date > dateNow);
    if (previousMoonEvent.type === "rise") {
        isMoonUp = true;
    } else if (previousMoonEvent.type === "set") {
        isMoonUp = false;
    }
    const sunProgress =
        (dateNow - previousSunriseSet) / (nextSunriseSet - previousSunriseSet);
    const moonProgress =
        (dateNow - previousMoonEvent.date) /
        (nextMoonEvent.date - previousMoonEvent.date);
    sunProgressOutput.textContent = `Sun Progress: ${Math.round(sunProgress * 100)}%`;
    moonProgressOutput.textContent = `Moon Progress: ${Math.round(moonProgress * 100)}%`;
    sunriseOutput.textContent = `Sunrise: ${sunrise}`;
    sunsetOutput.textContent = `Sunset: ${sunset}`;
    moonriseOutput.textContent = `Moonrise: ${moonrise}, Previous event: ${previousMoonEvent.date}`;
    moonsetOutput.textContent = `Moonset: ${moonset}, Next event: ${nextMoonEvent.date}`;
    sunStartTimeOutput.textContent = isSunUp ? "sunrise" : "sunset";
    sunEndTimeOutput.textContent = isSunUp ? "sunset" : "sunrise";
    moonStartTimeOutput.textContent = isMoonUp ? "moonrise" : "moonset";
    moonEndTimeOutput.textContent = isMoonUp ? "moonset" : "moonrise";
}
