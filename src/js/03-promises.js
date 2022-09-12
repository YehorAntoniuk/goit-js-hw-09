import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({ useIcon: false });

const refs = {
  form: document.querySelector('.form'),
  createBtn: document.querySelector('[type=submit]'),
};

let inputsData = {};
let intervalId = null;

refs.form.addEventListener('input', getInputsValue);
refs.form.addEventListener('submit', makePromises);

function makePromises(e) {
  e.preventDefault();
  let position = 0;
  let promiseDelay = Number(inputsData.delay);
  intervalId = setInterval(() => {
    position += 1;

    if (position > inputsData.amount) return;

    createPromise(position, promiseDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`, {
          timeout: 5000,
        });
      })

      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`, {
          timeout: 5000,
        });
      });

    promiseDelay += Number(inputsData.step);
  }, 0);
}

function getInputsValue(e) {
  inputsData[e.target.name] = e.target.value;
}
function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
