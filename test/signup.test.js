
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
    verified:true,
    token: ""
     },
 };
describe("TESTING User", () => {
  before(async () => {
    console.log("sync in test  ", process.env.NODE_ENV);
    try {
      await db.sequelize.sync({ force: true });
      console.log("db connected");
      
     
    } catch (error) {
      console.log(error);
    }
  });

  it("create account ", async () => {
    try {
      let { body, statusCode} = await request(server).post("/user/signup/")
      .send({ email: scope.userData.email,
        password: scope.userData.password,
        phoneNumber:  scope.userData.phoneNumber, 
        username: scope.userData.username,
        gender:"female" }) 
        expect(statusCode).to.deep.equal(201);
        expect(body).to.have.own.property("message");
        expect(body.data).to.have.own.property("phoneNumber");
        expect(body.data).to.have.own.property("gender");
        expect(body.data).to.have.own.property("username");
        expect(body.data).to.have.own.property("emailOTP");
        expect(body.data).to.have.own.property("password");
        expect(body.data).to.have.own.property("email");
        expect(body.data).to.have.own.property("verified");
        expect(body.data).to.have.own.property("id");
        expect(body).to.have.own.property("token");
        expect(body.message).to.deep.equal("An Email sent to your account please verify");
      } catch (error) {
        throw error;
      }
    });

    it("create account ", async () => {
      try {
        let { body, statusCode} = await request(server).post("/user/signup/")
        .send({ email: scope.userData.email,
          password: scope.userData.password,
          phoneNumber:  scope.userData.phoneNumber, 
          username: scope.userData.username,
          gender:"female" }) 
          expect(statusCode).to.deep.equal(409);
          expect(body).to.have.own.property("message");
          expect(body.message).to.deep.equal("email already exists");
        } catch (error) {
          throw error;
        }
      });
  

  });