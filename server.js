'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const { PORT } = require('./config');

app.use(cors());

const baseUrl = 'https://api.darksky.net/forecast/';
const API_KEY = process.env.API_KEY;
const coordinates = '45.5898,-122.5951'; //PDX Airport
const excludeQuery = 'currently,minutely,flags,daily';

//easily add more months by adding more select options in index.html and respective start values here 
const monthObjs2018 = {
  January: {
    startUnix: 1514793600,
    days: 31
  },
  February: {
    startUnix: 1517472000,
    days: 28
  },
  March: {
    startUnix: 1519891200,
    days: 31
  },
  April: {
    startUnix: 1522569600,
    days: 30
  },
  May: {
    startUnix: 1525161600,
    days: 31
  },
};

//creates array of unix values, starts with a days unix value and increments by 1 day 'num' times
const createUnixArray = (unix, num) => {
  let unixVal = +unix;
  let unixArray = [unixVal];
  for (let i = 2; i <= num; i++) { //array already has 1 so start on 2
    unixVal += 86400; // unix 24 hours == 86400
    unixArray.push(unixVal);
  }
  // console.log('unix array ',unixArray);
  return unixArray;
};

//receive month from front end and find corresponding start data in monthObjs2018
//return promises of axios calls for each day of the month
const convertUnixArrayToAxiosCallPromises = (month) => {
  const currentMonthsUnixDays = createUnixArray(monthObjs2018[month].startUnix, monthObjs2018[month].days);
  let promiseArray = currentMonthsUnixDays.map(unixTime => {
    return axios.get(`${baseUrl}${API_KEY}/${coordinates},${unixTime}?exclude=${excludeQuery}`);
  });
  return promiseArray;
};

//takes 1 days data and returns format: {ac: 0, heat: 1} 0 for 'it didn't turn on that day' and 1 for 'it did'
const parseData = (promiseResponseHourlyData) => {
  let temperatures = promiseResponseHourlyData.map(hour => hour.temperature);
  let high = Math.max(...temperatures);
  let low = Math.min(...temperatures);
  let answer = {}
  if (high > 75) {
    answer['ac'] = 1;
  } else {
    answer['ac'] = 0;
  }
  if (low < 62) {
    answer['heat'] = 1;
  } else {
    answer['heat'] = 0;
  }
  return answer;
};

app.get('/month', (req, res) => {
  let coldHotValueCount;
  if (req.query.month !== 'null') {
    Promise.all(convertUnixArrayToAxiosCallPromises(req.query.month))
      .then((response) => {
        coldHotValueCount = response.map(day => {
          //day.data.hourly.data = 1 array of 24 hourObjects, map one for every day in the promise and return if ac and/or heat turned on
          return parseData(day.data.hourly.data);
        });
      })
      .then(() => {
        //returning array of 24 parseData obj's -> {ac: 0, heat: 1}
        res.json(coldHotValueCount);
      });
  }
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
};
runServer();
module.exports = { app };