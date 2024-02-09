const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");

require("dotenv").config();

//* Middleware

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
//* MongoDB

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//* Schemas

const exerciseSchema = new mongoose.Schema({
  userId: { type: String },
  username: String,
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,
});

const userSchema = new mongoose.Schema({
  username: String,
});

//* Models

let User = mongoose.model("User", userSchema);

let Exercise = mongoose.model("Exercise", exerciseSchema);

//* Endpoints

//1. && 2.
app.post("/api/users", async function (req, res) {
  const { username } = req.body;
  const user = await User.create({ username });
  res.json(user);
});

//3. && 4. && 5.
app.get("/api/users", async function (req, res) {
  const users = await User.find();
  res.json(users);
});

//6. && 7.
app.post("/api/users/:_id/exercises", async function (req, res) {
  const userId = req.params._id;
  const { description, duration, date } = req.body;
  const user = await User.findById(userId);
  const exercise = await Exercise.create({
    userId,
    username: user.username,
    description,
    duration,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  });
  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: new Date(exercise.date).toDateString(),
    _id: user._id,
  });
});

//8. && 9. && 10. && 11. && 12.
app.get("/api/users/:_id/logs", async function (req, res) {
  const userId = req.params._id;

  const from = req.query.from || new Date(0).toDateString().substring(0, 10);
  const to = req.query.to || new Date(Date.now()).toDateString().substring(0, 10);
  const limit = Number(req.query.limit) || 0;

  const user = await User.findById(userId);
  const exercises = await Exercise.find({ userId }).limit(limit);

  let parsedDatesLog = exercises.map((exercise) => {
    return {
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
    };
  });

  res.json({
    username: user.username,
    count: parsedDatesLog.length,
    _id: user._id,
    log: parsedDatesLog,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
