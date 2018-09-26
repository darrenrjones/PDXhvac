# PDX Hvac Usage Report

Make a call to DarkSky.net API with PDX coordinates. Select the month and it will make the request and return how many times PDX turned on the heat and/or AC for that given month in 2018.

Example call:
https://api.darksky.net/forecast/3fb92e5379153ca5c71c720e44c31167/37.8267,-122.4233

After request is made it is stored in LocalStorage to reduce needless API calls. 

## Getting Started

git clone

npm install

sign up for darksky.net to get api key. 

create .env file at root and in .env file put: API_KEY='keygoeshere'

run local server with http-server

run server.js with: node server.js

## Authors

* **Darren Jones** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


