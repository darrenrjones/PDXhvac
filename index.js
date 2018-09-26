'use strict';

const url = 'http://localhost:8081';
const acCount = document.getElementById('ac-count');
const heatCount = document.getElementById('heat-count');

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('select[name="months-dropdown"]').onchange = handleMonthSelect;
}, false);

const generateHtml = (arrayOfAcHeatObjs) => {
  let ac = 0;
  let heat = 0;
  arrayOfAcHeatObjs.forEach(day => {
    ac += day.ac;
    heat += day.heat;
  })
  acCount.innerHTML = ac;
  heatCount.innerHTML = heat;
};

function handleMonthSelect(event) {
  const monthValue = event.target.value;
  //check localstorage to see if data already exists
  //if not make fetch to API
  if (!localStorage.getItem(monthValue)) {
    fetch(`${url}/month?month=${monthValue}`)
      .then(res => {
        res.json()
          .then(data => {
            localStorage.setItem(monthValue, JSON.stringify(data));
            generateHtml(data);

          });
      });
  } else {
    // localStorage was found so generateHtml with that instead. 
    let parsedLocalData = JSON.parse(localStorage.getItem(monthValue));
    generateHtml(parsedLocalData);
  }

}

