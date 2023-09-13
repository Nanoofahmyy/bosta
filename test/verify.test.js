
const chai = require("chai");
const expect = chai.expect;
const chaihttp = require("chai-http");
chai.use(chaihttp);

const request = chai.request;
const db = require("../models/index");
const server = require("../server");
var bcrypt = require("bcryptjs");


const scope = {
  userData: {
    email: "n.fahmy@agel.io",
    password: bcrypt.hashSync("123456789", 8),
    username:"test",
    phoneNumber:"01117393336" ,
    verified:false,
    emailOTP:"",
    token: ""
     },
 };
describe("TESTING User", () => {
  before(async () => {
    console.log("sync in test  ", process.env.NODE_ENV);
    try {
      await db.sequelize.sync({ force: true });
      console.log("db connected");
      let { body, statusCode} = await request(server).post("/user/signup/")
      .send({ email: scope.userData.email,
        password: scope.userData.password,
        phoneNumber:  scope.userData.phoneNumber, 
        username: scope.userData.username,
        gender:"female" }) 
      scope.userData.token = body.token;
      scope.userData.emailOTP=body.data.emailOTP
     
    } catch (error) {
      console.log(error);
    }
  });

  it("valify account ", async () => {
    try {
      let { body, statusCode} = await request(server).post("/user/verifyEmail")
      .send({ email: scope.userData.email,
              otp:scope.userData.emailOTP
        })
        .set({"authorization":`bearer ${scope.userData.token}` })
        expect(statusCode).to.deep.equal(200);
        expect(body).to.have.own.property("message");
        expect(body).to.have.own.property("status");
        expect(body.message).to.deep.equal("verified successfully");
      } catch (error) {
        throw error;
      }
    });

    
  it(" account already valified  ", async () => {
    try {
      let { body, statusCode} = await request(server).post("/user/verifyEmail")
      .send({ email: scope.userData.email,
              otp:"22222"
        })
        .set({"authorization":`bearer ${scope.userData.token}` })
        expect(statusCode).to.deep.equal(500);

      } catch (error) {
        throw error;
      }
    });

  

  });