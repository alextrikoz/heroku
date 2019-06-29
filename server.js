// server.js
// where your node app starts

// init project
const btoa = require("btoa"); // base64 encoder
const bodyParser = require("body-parser"); // allows us to take POST data in node
const axios = require("axios"); // http library
const qs = require("qs"); // querystring parsing
// const { encrypt, decrypt } = require("./crypto"); // encrypt/decrypt refresh_token

// express server
const express = require("express");
const app = express();

// environment variables
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CLIENT_CALLBACK_URL,
  ENCRYPTION_SECRET
} = process.env;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));

// accept form-urlencoded submissions
axios.interceptors.request.use(request => {
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data);
  }
  return request;
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (_, response) => {
  response.set("Content-Type", "text/json");
  response.status(200).send("hi from glitch.com/spotify :-)");
});

// POST /api/token
app.post("/api/token", ({body: {code: authorization_code}}, response) => {
  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)
    },
    data: {
      grant_type: "authorization_code",
      redirect_uri: SPOTIFY_CLIENT_CALLBACK_URL,
      code: authorization_code
    }
  }).then(({data: json}) => {
    // ▾▾▾ --- encrypted code --- ▾▾▾
    // let encrypted_access_token = encrypt(json.access_token, ENCRYPTION_SECRET);
    // response.set("Content-Type", "text/json").status(200).send(Object.assign({}, json, {refresh_token: encrypted_access_token}));
    
    // ▾▾▾ --- unencrypted code --- ▾▾▾
    response.set("Content-Type", "text/json").status(200).send(json);
  }).catch(({response: err}) => {
    response.set("Content-Type", "text/json").status(402).send(err.data);
  });
});

// POST /api/refresh_token
app.post("/api/refresh_token", ({body: {refresh_token}}, response) => {
  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)
    },
    data: {
      grant_type: "refresh_token",
      // ▾▾▾ --- unencrypted code --- ▾▾▾
      refresh_token: refresh_token,
      
      // ▾▾▾ --- encrypted code --- ▾▾▾
      // refresh_token: decrypt(refresh_token, ENCRYPTION_SECRET),
    }
  }).then(({data: json}) => {
    response.set("Content-Type", "text/json").status(200).send(json);
  }).catch(({response: err}) => {
    response.set("Content-Type", "text/json").status(402).send(err.data);
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
