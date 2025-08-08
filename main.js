import readline from "readline"; //readline module to read user input
import SunCalc from "suncalc"; //suncalc module to calculate sun and moon times
const input = readline.createInterface({
    //create readline interface
    input: process.stdin, //input using stdin (standard input)
    output: process.stdout, //output using stdout (standard output)
});
input.question("Enter latitude: ", (latitudeInput) => {
    //input latitude value
    const latitude = parseFloat(latitudeInput); //convert latitude to float
    input.question("Enter longitude: ", (longitudeInput) => {
        //input longitude
        const longitude = parseFloat(longitudeInput); //convert longitude to float
        const dateNow = new Date(); //current date and time
        const dayBeforeYesterday = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 2,
        ); //day before yesterday's date
        const yesterday = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 1,
        ); //yesterday's date
        const today = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate(),
        ); //today's date
        const tomorrow = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() + 1,
        ); //tomorrow's date
        const dayAfterTomorrow = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() + 2,
        ); //day after tomorrow's date
        const dates = [
            dayBeforeYesterday,
            yesterday,
            today,
            tomorrow,
            dayAfterTomorrow,
        ]; //list of dates
        const events = []; //list of moon rise/set events
        let previousMoonEvent = null,
            nextMoonEvent = null; //previous and next moon rise/set events
        for (const dateEvent of dates) {
            //repeat for each date
            const times = SunCalc.getMoonTimes(dateEvent, latitude, longitude); //get moonrise/moonset times
            if (times.rise != null || times.rise !== undefined) {
                events.push({ type: "rise", date: times.rise }); //add moonrise event
            }
            if (times.set != null || times.set !== undefined) {
                events.push({ type: "set", date: times.set }); //add moonset event
            }
            events.sort((a, b) => a.date - b.date); //sort events by date
            const previous = [...events]
                .reverse()
                .find((e) => e.date < dateNow); //get previous moon rise/set event from current date and time
            const next = events.find((e) => e.date > dateNow); //get next moon rise/set event from current date and time
            previousMoonEvent = previous;
            nextMoonEvent = next;
        }
        const times = SunCalc.getTimes(dateNow, latitude, longitude); //get sunrise/sunset times
        const previousDayTimes = SunCalc.getTimes(
            dateNow.setDate(dateNow.getDate() - 1),
            latitude,
            longitude,
        ); //get sunrise/sunset times yesterday
        const nextDayTimes = SunCalc.getTimes(
            dateNow.setDate(dateNow.getDate() + 1),
            latitude,
            longitude,
        ); //get sunrise/sunset times tomorrow
        const moonTimes = SunCalc.getMoonTimes(dateNow, latitude, longitude); //get moonrise/moonset times
        const sunrise = times.sunrise; //sunrise time
        const nextDaySunrise = nextDayTimes.sunrise; //sunrise time tomorrow
        const previousDaySunset = previousDayTimes.sunset; //sunset time yesterday
        const sunset = times.sunset; //sunset time
        let previousSunriseSet = null,
            nextSunriseSet = null; //previous and next sun rise/set times
        const moonrise = moonTimes.rise; //moonrise time
        const moonset = moonTimes.set; //moonset time
        let isSunUp = false; //check if is sun up or down
        let isMoonUp = false; //check if is moon up or down
        if (dateNow > sunrise && dateNow < sunset) {
            //if current time is between sunrise and sunset
            previousSunriseSet = sunrise;
            nextSunriseSet = sunset;
            isSunUp = true; //sun is up
        } else if (dateNow > sunset && dateNow < nextDaySunrise) {
            //if current time is between sunset and sunrise tomorrow
            previousSunriseSet = sunset;
            nextSunriseSet = nextDaySunrise;
            isSunUp = false; //sun is down
        } else if (dateNow > previousDaySunset && dateNow < sunrise) {
            //if current time is between sunset yesterday and sunrise
            previousSunriseSet = previousDaySunset;
            nextSunriseSet = sunrise;
            isSunUp = false; //sun is down
        }
        if (previousMoonEvent.type === "rise") {
            //if current time is between moonrise and moonset
            isMoonUp = true; //moon is up
        } else if (previousMoonEvent.type === "set") {
            //if current time is between moonset and moonrise
            isMoonUp = false; //moon is down
        }
        console.log(`Sunrise: ${sunrise} Sunset: ${sunset}`);
        console.log(`Moonrise: ${moonrise} Moonset: ${moonset}`);
        console.log(`Previous Sunrise/Sunset: ${previousSunriseSet}`);
        console.log(`Next Sunrise/Sunset: ${nextSunriseSet}`);
        console.log(`Previous Moonrise/Moonset: ${previousMoonEvent.date}`);
        console.log(`Next Moonrise/Moonset: ${nextMoonEvent.date}`);
        const sunProgress =
            (dateNow - previousSunriseSet) /
            (nextSunriseSet - previousSunriseSet); //calculate sun progress from rise/set event
        const moonProgress =
            (dateNow - previousMoonEvent.date) /
            (nextMoonEvent.date - previousMoonEvent.date); //calculate moon progress from rise/set event
        console.log(
            `Sun progress from ${isSunUp ? "sunrise to sunset: " : "sunset to sunrise: "} ${(sunProgress * 100).toFixed(2)}%`,
        );
        console.log(
            `Moon progress from ${isMoonUp ? "moonrise to moonset: " : "moonset to moonrise: "} ${(moonProgress * 100).toFixed(2)}%`,
        );
        input.close(); //close readline interface
    });
});
