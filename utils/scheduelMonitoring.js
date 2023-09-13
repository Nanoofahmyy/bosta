const schedule = require('node-schedule');
const axios = require('axios');
const db = require('../models'); // Import your Sequelize models
const calculate = require('./calculateMatrix');
const {sendMail} = require('../services/mail')
let isJobRunning = false; // Variable to track the job status
const intervalInSeconds = 60; // Adjust as needed (e.g., 10 minutes)
module.exports = {
job : async () => {

    if (isJobRunning) {
        console.log('Job is already running, skipping this execution.');
        return;
      }
    
      try {
        isJobRunning = true; // Set job status to running
        let result=[];
  let urlChecks = await db.CheckUrl.findAll();
  if (urlChecks.length){
      for (let i = 0 ; i < urlChecks.length ; i++){
        let userId = urlChecks[i].UserId;
        const user = await db.User.findOne({ where: { id:userId } });
        result.push(user.email);
        
      }
      console.log("🚀 ~ file: scheduelMonitoring.js:25 ~ job: ~ result:", result)

  }  
  for (const urlCheck of urlChecks) {
    try {
       const startTime = Date.now();
       const response = await axios.get(urlCheck.url)
       let reportStatus = await db.Report.findAll({ where: { status: "down"}})
        console.log("🚀 ~ file: scheduelMonitoring.js:35 ~ job: ~ reportStatus:", reportStatus)
        if ( (response.status === 500 || response.status === 502)  ){
     //   if ( (urlCheck.assert === 500 || response.status === 502)  ){
       await sendMail({
         to:  result,
         subject:' server down ',
         html: `
         <div
           class="container"
           style="max-width: 90%; margin: auto; padding-top: 20px"
         >
           <h2>Welcome to server.</h2>
           <p style="margin-bottom: 30px;">please notice that server is down</p>
           <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${response.status}</h1>
      </div>
       `,
   });

      }
  
      if (response.status !==500 && response.status !==502 && reportStatus.length !== 0 ){  
        await sendMail({
          to:  result,
          subject:' server starting again',
          html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Welcome to server.</h2>
            <p style="margin-bottom: 30px;">please notice that server is up again</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${response.status}</h1>
       </div>
        `,
    });
    for (let i = 0; i < reportStatus.length; i++) {
     let  reportId = reportStatus[i].id
     let updateReport= await db.Report.update({ status: "up"} , {where: { status: "down" ,id :reportId }})
        }
    }
        //, {
    //     timeout: urlCheck.timeout || 500000, // Default timeout to 5 seconds if not provided
    //   });
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      let matrix = await calculate.calculateMetrics (urlCheck.id)
  

      // Calculate metrics
      const isUp = response.status === 200;
      const reportData = {
        status: isUp ? 'up' : 'down',
        responseTime,
        CheckUrlId: urlCheck.id,
        availability : matrix.availability,
        outages: matrix.outages,
        uptime: matrix.uptime,
        downtime: matrix.downtime

      };
      await db.Report.create(reportData);
    }
      catch (error) {
        console.error("Error while monitoring URL:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching URL checks:", error);
  } finally {
    isJobRunning = false; // Set job status to not running
  }
 
},

}