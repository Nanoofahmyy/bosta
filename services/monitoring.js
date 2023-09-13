const db = require('../models/index')
const {sequelize} = require('../config/db');;
const { generateOTP } = require('../services/OTP'); 
const checkUrl = require('../models/CheckUrl');
const {sendMail} = require('../services/mail')
const { BadRequest , NotFound} = require('../utils/Error');
const { ok} = require('../utils/standardResponse');
const axios = require('axios');

const createCheckUrl = async (request , response) => {
  let  isUp ;
 // const response = await axios.get(body.url);
    response = await axios.get(request.body.url);
  const newCheckUrl = await db.CheckUrl.create({
     name :request.body.name,
      url:request.body.url,
      protocol:(response.config.adapter).toUpperCase(),
      path:request.body.path,
      port:request.body.port,
      webhook:request.body.webhook,
      timeout:response.config.timeout,
      interval:request.body.interval,
      threshold:request.body.threshold,
      authentication:request.body.authentication,
      httpHeaders:request.body.httpHeaders,
      assert:response.status,
      tags:request.body.tags,
      ignoreSSL:request.body.ignoreSSL,
      UserId:request.user.id
     
  });
   response = await axios.get(newCheckUrl.url);  
  try {
    
    return newCheckUrl;
  } catch (error) {
    return [false, 'Unable to sign up, Please try again later', error];
  }
};

module.exports= {
    createCheckUrl,
}