const express = require('express');
const app = express();
const https = require('https')
const bodyParser = require('body-parser');
const fetch = require('node-fetch')
var cors = require('cors')

const port = 8080;
const about = require('./about');

app.use(bodyParser.json())

var corsOptions = {
  origin: 'http://localhost:8081/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
//app.use(cors())

app.all('/', cors(corsOptions), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

app.get('/about.json', (req, res, next) => {
    let rep = about;
    rep.about.customer = req.ip;
    rep.about.server.current_time = new Date().getTime() / 1000;
    res.send(rep);
})

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.get('/steam-games', cors(corsOptions), async function (req, res, next) {

  let rep = await (await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/`, {method: "GET"})).json();

  return res.status(200).json({
    status: 'success',
    data: rep
  })
})

app.get('/steam-stats/:id', cors(corsOptions), async function (req, res, next) {
  let rep = await (await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${req.params.id}`, {method: "GET"})).json();

  return res.status(200).json({
    status: 'success',
    data: rep
  })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})