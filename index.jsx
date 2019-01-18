import { css, styled } from "uebersicht";
export const command = undefined;
export const refreshFrequency = 3600000; //update every hour

// ============================================
//					CSS Styles
// ============================================

export const className = `
	left: 35px;
	bottom: 950px;
	color: #FF6C40;
	font-weight: bold;
`;

const Error = styled("h2")`
	font-family: Arial;
	font-size: 1.5em;
	color: red;
	text-align: center;
`;

const Headline = styled("h1")`
	font-family: Helvetica;
	font-size: 20px;
	margin-bottom: 10px;
	text-align: center;
`;

const Calendar = styled("div")`
	display: grid;
	grid-template-columns: repeat(7, 25px);
	grid-template-rows: 35px repeat(5, 25px);
`;

const Day = css`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-family: Helvetica;
`;

const Today = styled("div")`
	color: #fddcc9;
	background: #7d0032;
	border-radius: 50%;
`;

// ============================================
//					JS Logic
// ============================================

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
let week = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
let todaysDate = new Date().getDate(); // todays number calendar day
let year = new Date().getFullYear(); // 20XX
let month = new Date().getMonth() + 1; // 1 - 12
let monthString = month < 10 ? `0${month}` : month; // 01 - 12
let FirstOfMonthString = `${year}-${monthString}-01`;
let weekdayOfFirstOfMonth = new Date(FirstOfMonthString).getDay() + 1; //number of days to skip on calendar

let currentMonthDays = new Date(year, month, 0).getDate(); //get number of days in todays month

//create an array with the number of days of todays month
let daysOfTheMonth = [];
for (let i = 1; i <= currentMonthDays; i++) {
	daysOfTheMonth.push(i);
}

function addCalendarGaps(daysToSkip) {
	//clone array
	let clonedCalendarArray = JSON.parse(JSON.stringify(daysOfTheMonth));
	//add empty calendar slots
	for (let i = 1; i < daysToSkip; i++) {
		clonedCalendarArray.unshift("");
	}
	return clonedCalendarArray;
}

export const render = ({ output, error }) => {
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
					<div key={day} className={Day}>
						{day}
					</div>
				))}
				{addCalendarGaps(weekdayOfFirstOfMonth).map(day =>
					day == todaysDate ? (
						<Today key={day} className={Day}>
							{day}
						</Today>
					) : (
						<div key={day} className={Day}>
							{day}
						</div>
					)
				)}
			</Calendar>
		</main>
	);
};
