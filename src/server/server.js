const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const ConfigSchema = require("./schema/ConfigSchema");
import {mongoUser,mongoPassword,mongoUrl,isReleaseDateValid, apiPport} from "../config";

const API_PORT = apiPport;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = `mongodb://${mongoUser}:${mongoPassword}@${mongoUrl}`;

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getReleaseDate", (req, res) => {
    ConfigSchema.find({'name': 'ReleaseDate'}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateReleaseDate", (req, res) => {
  const { newReleaseDate } = req.body;
  if(!releaseDate || !isReleaseDateValid(newReleaseDate)){
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }


  ConfigSchema.findOneAndUpdate({'name': 'ReleaseDate'}, {'value': newReleaseDate}, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putReleaseDate", (req, res) => {
  let configSchema = new ConfigSchema();

  const { releaseDate } = req.body;

  if (!releaseDate || !isReleaseDateValid(releaseDate)) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  configSchema.value = releaseDate;
  configSchema.name = 'ReleaseDate';

  configSchema.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));