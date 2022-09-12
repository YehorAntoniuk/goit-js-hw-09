import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({ position: 'center-top' });

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  dayInterface: document.querySelector('[data-days]'),
  hoursInterface: document.querySelector('[data-hours]'),
  minsInterface: document.querySelector('[data-minutes]'),
  secInterface: document.querySelector('[data-seconds]'),
};

const today = new Date();

let selectedDatesUTC = 0;
let intervalId = null;

refs.startBtn.addEventListener('click', startTimer);
refs.startBtn.disabled = true;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDatesUTC = selectedDates[0].getTime();
    dateValidation(selectedDates[0]);
  },
});

function dateValidation(date) {
  if (date <= today) {
    Notify.warning('Please choose a date in the future', {
      timeout: 3000,
    });

    refs.startBtn.disabled = true;
  }

  if (date > today) {
    refs.startBtn.disabled = false;
  }
}

function startTimer() {
    refs.input.disabled = true;
    refs.startBtn.disabled = true;
    

  intervalId = setInterval(() => {
    let nowUTC = new Date().getTime();
    let timerValue = convertMs(selectedDatesUTC - nowUTC);

    const { days, hours, minutes, seconds } = timerValue;

    let SumDateValue = days + hours + minutes + seconds;

    if (SumDateValue === 0) {
      clearInterval(intervalId);
    }

    refs.dayInterface.textContent = pad(days);
    refs.hoursInterface.textContent = pad(hours);
    refs.minsInterface.textContent = pad(minutes);
    refs.secInterface.textContent = pad(seconds);
  }, 1000);
}

function pad(num) {
  return String(num).padStart(2, 0);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
