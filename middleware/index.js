var bcrypt = require("bcryptjs");
const db = require('../models/index')
const {sequelize} = require('../config/db');
const { generateOTP } = require('../services/OTP'); 
const User = require('../models/User');
const {sendMail} = require('../services/mail')
const { BadRequest , NotFound} = require('../utils/Error');
const { ok} = require('../utils/standardResponse');


const createUser = async (body) => {
 const hashedPassword = bcrypt.hashSync (body.password,8)
  const otpGenerated = generateOTP();
  const newUser = await db.User.create({ email: body.email,password: hashedPassword, emailOTP: otpGenerated,username: body.username,phoneNumber: body.phoneNumber,gender: body.gender});
  try {
    await sendMail({
          to:  body.email ,
          subject:'Hello ✔',
          html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Welcome to the club.</h2>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otpGenerated}</h1>
       </div>
        `,
       
    });
    return newUser;
  } catch (error) {
    return [false, 'Unable to sign up, Please try again later', error];
  }
};

const validateUserSignUp = async (email, otp) => {
  const user = await db.User.findOne({ where: {email: email , verified: false} });
  if (user == null)  throw new NotFound('user not found');
  if (user && user.emailOTP !== otp)  throw (new BadRequest ('Invalid OTP')); 
};


module.exports= {
  createUser,
  validateUserSignUp
}