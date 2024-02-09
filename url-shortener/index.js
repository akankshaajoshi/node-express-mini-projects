require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const url = require("url");
const bodyParser = require("body-parser");
const dns = require("dns");
const shortid = require("shortid");
const validator = require("validator");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//Create a database to store and fetch url's

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: {
    type: String,
    default: shortid.generate,
  },
});

const Url = mongoose.model("Url", urlSchema);

//Get the short url : OK
const URL = url.URL;

app.get("/api/shorturl/:url", (req, res, next) => {
  const { url } = req.params;
  Url.findOne({ short_url: url })
    .then((url) => {
      if (!url) {
        throw new Error("Url is not found on database");
      }
      res.redirect(url.original_url);
    })
    .catch((err) => res.send({ error: err.message }));
});

app.post("/api/shorturl", (req, res, next) => {
  const { url } = req.body;
  try {
    if (!validator.isURL(url)) {
      res.send({ error: "invalid url" });
    }
    const objUrl = new URL(url);
    dns.lookup(objUrl.hostname, (err, address, family) => {
      if (err) throw err;
      const original_url = objUrl.href;

      Url.findOne({ original_url })
        .then((url) => {
          if (url) return url;
          return Url.create({ original_url });
        })
        .then((url) => {
          const { original_url, short_url } = url;
          return res.send({ original_url, short_url });
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (err) {
    console.log(err);
    return res.send({ error: err.message });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
