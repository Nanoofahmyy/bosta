const db = require('../models'); 
module.exports = {

 calculateMetrics : async  (CheckUrlId) =>{
    const reports = await db.Report.findAll({ where: { CheckUrlId } });
    const totalRequests = reports.length;
    const successfulRequests = reports.filter((report) => report.status === 'up').length;
    const failedRequests = parseInt(totalRequests) - parseInt(successfulRequests);
    const intervalInSeconds = db.CheckUrl.interval / 1000; // Convert milliseconds to seconds
    const availability = parseInt((successfulRequests / totalRequests)) * 100;
    const outages = failedRequests;
    const downtime =  isNaN(parseInt(failedRequests) * parseInt(intervalInSeconds)) ? 0 :downtime;
     const uptime = isNaN(parseInt((totalRequests - failedRequests)) * parseInt(intervalInSeconds)) ? 0 :uptime;
    const responseTimes = reports.map((report) => report.responseTime);
    const averageResponseTime = responseTimes.reduce((acc, time) => acc + time, 0) / totalRequests;
  
    return {
      availability,
      outages,
      downtime,
      uptime,
      averageResponseTime,
      
    };
  }
}