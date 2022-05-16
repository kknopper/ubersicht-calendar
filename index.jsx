import { css, styled } from "uebersicht";

// ============================================
// Calendar Settings
// ============================================
const calendarStartDay = 0; //set 0 - 6 for the days of the week. Default is 0 for Sunday.
const color = "white"; //set color for all calendar days
const todaysColor = "black"; //set color for todays date

export const refreshFrequency = 3600000; // app refresh time in ms, Update every hour

// ============================================
// CSS Styles
// ============================================
export const className = `
	left: 35px;
	bottom: 35px;
	color: ${color};
	font-family: Helvetica;
	font-weight: bold;
	z-index: 1;
`;

const Error = styled("h2")`
	font-size: 1.5em;
	color: red;
	text-align: center;
`;

const Headline = styled("h1")`
	font-size: 20px;
	margin-bottom: 15px;
	text-align: center;
`;

const Calendar = styled("div")`
	display: grid;
	grid-template-columns: repeat(7, 25px);
	grid-template-rows: 25px repeat(5, 25px);
`;

const Weekday = styled("div")`
	font-weight: normal;
	font-size: 12px;
	text-align: center;
`;

const Day = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-family: Helvetica;
`;

const today = css`
	background: ${color};
	color: ${todaysColor};
	border-radius: 50%;
`;

// ============================================
// JS Logic
// ============================================

function addCalendarGaps(daysToSkip, daysOfTheMonth) {
	let clonedCalendarArray = JSON.parse(JSON.stringify(daysOfTheMonth));
	//add blank indexes to clonedCalendar Array for Calendar gaps
	for (let i = 1; i < daysToSkip; i++) {
		clonedCalendarArray.unshift("");
	}
	return clonedCalendarArray;
}

function reorderCalendar(startDay, calendarWeekArray) {
	let sendToBack = calendarWeekArray.slice(0, startDay);
	let sendToFront = calendarWeekArray.slice(startDay, calendarWeekArray.length);
	return sendToFront.concat(sendToBack);
}

export const command = dispatch => {
	let months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	let sundayWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	let week;
	calendarStartDay > 0
		? (week = reorderCalendar(calendarStartDay, sundayWeek))
		: (week = sundayWeek);

	let todaysDate = new Date().getDate(); // todays number calendar day
	let year = new Date().getFullYear(); // 20XX
	let month = new Date().getMonth() + 1; // 1 - 12
	let monthString = month < 10 ? `0${month}` : month; // 01 - 12
	let FirstOfMonthString = `${year}-${monthString}-01`;
	let weekdayFirstOfMonth = new Date(FirstOfMonthString).getDay(); //first day of the month
	let daysToSkip = week.indexOf(sundayWeek[weekdayFirstOfMonth]) + 1;
	let currentMonthDays = new Date(year, month, 0).getDate(); //get number of days in todays month

	//create an array with the number of days of todays month
	let daysOfTheMonth = [];
	for (let i = 1; i <= currentMonthDays; i++) {
		daysOfTheMonth.push(i);
	}

	dispatch({
		type: "DATA",
		data: {
			year,
			months,
			month,
			week,
			todaysDate,
			daysToSkip,
			daysOfTheMonth
		}
	});
};

export const updateState = (event, previousState) => {
	switch (event.type) {
		case "DATA":
			console.log("data:", event.data);
			return event.data;
		default:
			console.log("previous:", previousState);
			return previousState;
	}
};

export const render = ({
	error,
	year,
	months,
	month,
	week,
	todaysDate,
	daysToSkip,
	daysOfTheMonth
}) => {
	return error ? (
		<Error>
			Something went wrong: <strong>{String(error)}</strong>
		</Error>
	) : (
		<main>
			<header>
				<Headline>{`${months[month - 1]} ${year}`}</Headline>
			</header>
			<Calendar>
				{week.map(day => (
					<Weekday key={day}>{day}</Weekday>
				))}
				{addCalendarGaps(daysToSkip, daysOfTheMonth).map((day, i) =>
					day == todaysDate ? (
						<Day className={today} key={i}>
							{day}
						</Day>
					) : (
						<Day key={i}>{day}</Day>
					)
				)}
			</Calendar>
		</main>
	);
};
