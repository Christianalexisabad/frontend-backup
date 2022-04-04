import moment from "moment";

// DATE FORMATS
const YEAR_FORMAT = "YYYY";
const DATE_TIME_FORMAT = "YYYY-MM-DD hh:mm:ss A";
const CURRENT_DATE_FORMAT = "YYYY-MM-DD";
const CURRENT_TIME_FORMAT = "hh:mm:ss A";

// CURRENT DATE
let DATE = new Date();
let CURRENT_YEAR = moment(DATE).format(YEAR_FORMAT);
let DATE_TIME = moment(DATE).format(DATE_TIME_FORMAT);
let CURRENT_DATE = moment(DATE).format(CURRENT_DATE_FORMAT);
let CURRENT_TIME = moment(DATE).format(CURRENT_TIME_FORMAT);

export function formatDate (date, format) {
    return moment(date).format(format);
}

export function getDateTime () {
    return DATE_TIME;
}

export function getCurrentYear () {
    return parseInt(CURRENT_YEAR);
}

export function getYear(years) {

    years = years ? years : 0;
    let year = moment(CURRENT_DATE).add(years, 'years').format('YYYY-MM-DD');
    return year.split('-')[0];
}

export function to24Hour(time) {
    try {
        time = moment(CURRENT_DATE + " " + time).format('YYYY-MM-DD HH:mm');
        time = time.split(" ")[1];
        return time;
    } catch (error) {
        return "00:00";        
    }
}

export function getEndDate(startDate, probationaryPeriod) {
    const period = probationaryPeriod.split(" ");
    return moment(startDate).add(parseInt(period[0]), period[1].replace("s", "")).format('YYYY-MM-DD');
}

export function getLeaveEndDate(startDate, days) {
    return moment(startDate).add(days, 'day').format('YYYY-MM-DD');
}

export function getCurrentDate () {
    return CURRENT_DATE;
}

export function getCurrentTime () {
    return CURRENT_TIME;
}

export function isTimeEqualTo(time, to) {
    return time === to;
}

export function isTimeRange(time, from, to) {   
    time = new Date(CURRENT_DATE + " " + time).getTime();
    from = new Date(CURRENT_DATE + " " + from).getTime();
    to = new Date(CURRENT_DATE + " " + to).getTime();
    return time >= from && time <= to;
}

export function isTimeLessThan(time, to) {
    time = new Date(CURRENT_DATE + " " + time).getTime();
    to = new Date(CURRENT_DATE + " " + to).getTime();
    return time < to;
}

export function isTimeLessThanOrEqual(time, to) {
    time = new Date(CURRENT_DATE + " " + time).getTime();
    to = new Date(CURRENT_DATE + " " + to).getTime();
    return time <= to;
}

export function isTimeGreaterThanOrEqual(time, to) {
    time = new Date(CURRENT_DATE + " " + time).getTime();
    to = new Date(CURRENT_DATE + " " + to).getTime();
    return time >= to;
}

export function isTimeGreaterThan(time, to) {
    time = new Date(CURRENT_DATE + " " + time).getTime();
    to = new Date(CURRENT_DATE + " " + to).getTime();
    return time > to;
}

export function isDateGreaterThan(date, to) {
    date = formatDate(date, CURRENT_DATE_FORMAT);
    to = formatDate(to, CURRENT_DATE_FORMAT);
    return date > to;
}

export function isDateValid (time ,to) {
    time = moment(time).format(CURRENT_DATE_FORMAT)
    to = moment(to).format(CURRENT_DATE_FORMAT)
    return time >= to;
}

export function toDate(date) {
    return formatDate(date, CURRENT_DATE_FORMAT);
}

export function getDateDifference(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24 * 60);
}

export function getTimeDifference(time1, time2) {
    let date1 = new Date(CURRENT_DATE + " " + time1);
    let date2 = new Date(CURRENT_DATE + " " + time2);
    return (date2.getTime() - date1.getTime()) / (1000 * 60);
}

export function getAge(dob) { 
    var diff_ms = new Date() - new Date(dob).getTime();
    var age_dt = new Date(diff_ms); 
    return parseInt(Math.abs(age_dt.getUTCFullYear() - 1970));
}

export function getReducedDate(date, days) { 
    return moment(date).subtract(days, 'd').format(CURRENT_DATE_FORMAT);
}

export function subtractHour(time, value) { 
    time = moment(time, ["HH:mm:ss A"]).format("hh:mm:ss A");
    return time
    // return moment(CURRENT_DATE + " " + time).subtract(parseInt(value), 'minutes').format(CURRENT_TIME_FORMAT);
}

export function subtractMinute(time, value) { 
    return moment(CURRENT_DATE + " " + time).subtract(parseInt(value), 'minutes').format(CURRENT_TIME_FORMAT);
}

export function subtractSecond(time, value) { 
    return moment(CURRENT_DATE + " " + time).subtract(parseInt(value), 'seconds').format(CURRENT_TIME_FORMAT);
}

export function addMinute(time, value) { 
    return moment(CURRENT_DATE + " " + time).add(parseInt(value), 'minutes').format(CURRENT_TIME_FORMAT);
}

export function addSecond(time, value) { 
    return moment(CURRENT_DATE + " " + time).add(parseInt(value), 'seconds').format(CURRENT_TIME_FORMAT);
}

export function substractSecond(time, value) { 
    return moment(CURRENT_DATE + " " + time).subtract(parseInt(value), 'seconds').format(CURRENT_TIME_FORMAT);
}

export function getAddedDate(date, days) { 

    for (let index = 1; index <= days; index++) {
       const day = moment(date).add(days, 'day').format('dddd');
       if (day === 'Saturday' || day === 'Sunday') {
           days += 1;
       }
    }

    return moment(date).add(days, 'd').format(CURRENT_DATE_FORMAT);
}

