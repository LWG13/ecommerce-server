
const userConnect = require("./userConnect.cjs")
const express = require('express');
const route = require("./route.cjs")
const cors = require("cors");
require("dotenv/config")
const connect = require("./connect.cjs")
var cron = require('node-cron');
const bodyParser = require("body-parser")
const app = express();
app.use(cors({ origin: true, credentials: true }))

connect()
userConnect()
app.use(bodyParser.json({ limit: "50mb" }))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
route(app)
app.listen(3000, () => {
  console.log("Server Runnin")
})


cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});