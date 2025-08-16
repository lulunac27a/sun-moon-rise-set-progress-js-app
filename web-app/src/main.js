import suncalc from "suncalc"; //suncalc module to calculate sun and moon times
const latitudeInput = document.getElementById("latitude"); //latitude input
const longitudeInput = document.getElementById("longitude"); //longitude input
const sunriseOutput = document.getElementById("sunrise"); //sunrise output
const sunsetOutput = document.getElementById("sunset"); //sunset output
const moonriseOutput = document.getElementById("moonrise"); //moonrise output
const moonsetOutput = document.getElementById("moonset"); //moonset output
const sunStartTimeOutput = document.getElementById("sun-start-time"); //sun start time output
const sunEndTimeOutput = document.getElementById("sun-end-time"); //sun end time output
const sunProgressOutput = document.getElementById("sun-progress"); //sun progress output
const moonStartTimeOutput = document.getElementById("moon-start-time"); //moon start time output
const moonEndTimeOutput = document.getElementById("moon-end-time"); //moon end time output
const moonProgressOutput = document.getElementById("moon-progress"); //moon progress output

document.getElementById("calculate").addEventListener("click", calculate); //calculate button click event
//function to calculate sun and moon times
function calculate() {
    //function to calculate sun and moon times
    const dateNow = new Date(); //current date and time
    const moonEvents = []; //list of moon rise/set events
    let previousMoonEvent = null; //previous moon rise/set event
    let nextMoonEvent = null; //next moon rise/set event
    const latitude = parseFloat(latitudeInput.value); //parse latitude input to float
    const longitude = parseFloat(longitudeInput.value); //parse longitude input to float
    const previousDayTimes = suncalc.getTimes(
        new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 1,
        ),
        latitude,
        longitude,
    ); //get sunrise/sunset times yesterday
    const times = suncalc.getTimes(dateNow, latitude, longitude); // get sunrise/sunset times today
    const nextDayTimes = suncalc.getTimes(
        new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() + 1,
        ),
        latitude,
        longitude,
    ); //get sunrise/sunset times tomorrow
    const moonTimes = suncalc.getMoonTimes(dateNow, latitude, longitude); //get moon rise/set times today
    const sunrise = times.sunrise; //sunrise time
    const sunset = times.sunset; //sunset time
    const moonrise = moonTimes.rise; //moonrise time
    const moonset = moonTimes.set; //moonset time
    let isSunUp = false; //check if sun is up or down
    let isMoonUp = false; //check if moon is up or down
    let previousSunriseSet = null;
    let nextSunriseSet = null;
    if (dateNow > sunrise && dateNow < sunset) {
        //if current time is between sunrise and sunset
        isSunUp = true; //sun is up
        previousSunriseSet = times.sunrise;
        nextSunriseSet = times.sunset;
    } else if (dateNow > sunset && dateNow < nextDayTimes.sunrise) {
        //if current time is between sunset and sunrise tomorrow
        isSunUp = false; //sun is down
        previousSunriseSet = times.sunset;
        nextSunriseSet = nextDayTimes.sunrise;
    } else if (dateNow > previousDayTimes.sunset && dateNow < sunrise) {
        //if current time is between sunset yesterday and sunrise
        isSunUp = false; //sun is down
        previousSunriseSet = previousDayTimes.sunset;
        nextSunriseSet = times.sunrise;
    }
    for (let i = -2; i <= 2; i++) {
        //repeat for each date from two days before to two days after
        let dateEvent = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() + i,
        );
        let moonTimes = suncalc.getMoonTimes(
            dateEvent,
            latitudeInput.value,
            longitudeInput.value,
        ); //get moonrise/moonset times for specific date
        if (moonTimes.rise) {
            moonEvents.push({ type: "rise", date: moonTimes.rise }); //add moonrise event
        }
        if (moonTimes.set) {
            moonEvents.push({ type: "set", date: moonTimes.set }); //add moonset event
        }
    }
    moonEvents.sort((a, b) => a.date - b.date); //sort events by date
    previousMoonEvent = [...moonEvents].reverse().find((e) => e.date < dateNow); //get previous moon rise/set event from current date and time
    nextMoonEvent = moonEvents.find((e) => e.date > dateNow); //get next moon rise/set event from current date and time
    if (previousMoonEvent && nextMoonEvent) {
        //check if previous and next moon events exist
        if (previousMoonEvent.type === "rise" && nextMoonEvent.type === "set") {
            //if current time is between moonrise and moonset
            isMoonUp = true; //moon is up
        } else if (
            previousMoonEvent.type === "set" &&
            nextMoonEvent.type === "rise"
        ) {
            //if current time is between moonset and moonrise
            isMoonUp = false; //moon is down
        }
    }
    const sunProgress =
        (dateNow - previousSunriseSet) / (nextSunriseSet - previousSunriseSet); //sun progress
    const moonProgress =
        (dateNow - previousMoonEvent.date) /
        (nextMoonEvent.date - previousMoonEvent.date); //moon progress
    //update the output elements with the calculated values
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
