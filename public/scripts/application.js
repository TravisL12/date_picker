const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

const createDate = (year, month) => {
  const date = new Date(year, month, 0); // 0-index month (0 - 11)
  const firstDay = new Date(year, month).getDay(); // 0-index day of week (0 - 6)
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prettyName = date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
  });

  return {
    firstDay,
    totalDays,
    prettyName,
  };
};

const randomSelector = () => Math.random().toString(36).substring(7);

const isSelected = (isSelected) => {
  return isSelected ? 'selected' : '';
};

const isChecked = (isChecked) => {
  return isChecked ? 'checked' : '';
};

class Calendar {
  constructor(startDate) {
    this.startDate = startDate ? new Date(startDate) : new Date();
    this.selector = randomSelector();
    this.calendar = document.createElement('div');
    this.calendar.id = `calendar-${this.selector}`;
    this.calendar.classList.add('calendar');
    this.selectedMonth = this.startDate.getMonth(); // 0-indexed month
    this.selectedYear = this.startDate.getFullYear();
    this.calendar.innerHTML = `
    <form class='title'></form>
    <div class='dow-container'></div>
    <div class='grid'></div>
    `;
    this.grid = this.calendar.querySelector('.grid');
    this.dow = this.calendar.querySelector('.dow-container');
    this.title = this.calendar.querySelector('.title');

    document.body.appendChild(this.calendar);
    this.createTitle();
    this.setDate();
  }

  createTitle() {
    for (let i = 0; i < 7; i++) {
      const dow = document.createElement('div');
      dow.classList = 'dow';
      dow.textContent = daysOfWeek[i];
      this.dow.appendChild(dow);
    }

    const monthsSelect = months.reduce((acc, month, idx) => {
      return (
        acc +
        `<option value="${idx}" ${isSelected(
          idx === this.selectedMonth
        )}>${month}</option>`
      );
    }, '');

    let yearsSelect = '';
    for (let i = 1980; i < 2030; i++) {
      yearsSelect += `<option value="${i}" ${isSelected(
        i === this.selectedYear
      )}>${i}</option>`;
    }

    this.title.innerHTML = `
      <select name="months">${monthsSelect}</select>
      <select name="years">${yearsSelect}</select>
    `;

    this.title.addEventListener('change', (event) => {
      const { name, value } = event.target;
      if (name === 'months') {
        this.selectedMonth = +value;
      } else {
        this.selectedYear = value;
      }
      this.setDate();
    });
  }

  setDate(
    selectedYear = this.selectedYear,
    selectedMonth = this.selectedMonth,
    selectedDay = this.startDate.getDate()
  ) {
    if (!this.grid) {
      return;
    }
    this.grid.innerHTML = '';
    this.date = createDate(selectedYear, selectedMonth);

    for (let i = 0; i < this.date.totalDays; i++) {
      const day = this.createDayTile(i, i === selectedDay - 1);
      this.grid.appendChild(day);
    }
  }

  createDayTile(dayNum, checked) {
    const day = document.createElement('div');
    day.classList = 'day';
    if (dayNum === 0) {
      day.style['grid-column-start'] = this.date.firstDay + 1; // 1-indexed
    }
    day.innerHTML = `
      <input type='radio' ${isChecked(checked)} id='${this.selector}-${
      dayNum + 1
    }' name='${this.selector}-dates' />
      <label for='${this.selector}-${dayNum + 1}'>${dayNum + 1}</label>
    `;
    return day;
  }
}

const cal1 = new Calendar('1980-12-4');
const cal2 = new Calendar('2011-9-15');
const cal3 = new Calendar();
