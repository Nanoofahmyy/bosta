const express = require('express')
const path = require('path');
const envFilePath = path.resolve(`./config/.env.${process.env.NODE_ENV}`);
const axios = require('axios');
console.log('app env file:', envFilePath)
require('dotenv').config({ path: envFilePath });
// require('dotenv').config({path:'../config/.env'})
const bodyParser = require('body-parser')
var morgan = require('morgan')
const nodeSchedule = require('node-schedule');
const nodeCron = require("node-cron")
const router = require('./routes/index');

const app = express()
const PORT = process.env.PORT || 5000;
const db = require('./models/index');

const utils = require('./utils/scheduelMonitoring')
const pushOver = require('./services/pushover')
//DB options
if (!process.env.NODE_ENV.includes('test')) {
  db.sequelize.sync({ alter: true }).then(() => {

    console.log('db connected')
    //jobFunction();
  }).catch((error) => console.log(error));

 
}

 const intervalInSeconds = 120; // Adjust as needed (e.g., 10 minutes)

// const job = nodeSchedule.scheduleJob(`*/${intervalInSeconds} * * * *`, jobFunction);
// job.schedule(); // Start the scheduled job
pushOver;
nodeCron.schedule(`1 * * * * *`, async function () {
  //const jobFunction = async function () {
  console.log('Running Cron Job');
   await utils.job() 
  console.log('Cron Job Done');
  }
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())
app.use(router)
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`server is running  on port ${PORT}`))
module.exports = app