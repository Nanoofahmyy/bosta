
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
    emailOTP:"kjhkjh",
    token: ""
     },
   urlData:{
    createdAt: '2023-09-12T21:13:56.787Z',
  updatedAt: '2023-09-12T21:13:56.787Z',
  interval: 600,
  threshold: 1,
  authentication: { password: 'defaultPassword', username: 'defaultUser' },
  httpHeaders: [ { key: 'User-Agent', value: 'MyApp' } ],
  tags: [ 'defaultTag' ],
  ignoreSSL: true,
  id: 1,
  name: 'test',
  url: 'https://www.google.com',
  protocol: 'HTTP',
  path: null,
  port: null,
  timeout: 0,
  assert: 200,
  UserId:1
   }
 };
describe("TESTING checkurl", () => {
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
        scope.userData.id= body.id
        scope.userData.emailOTP=body.data.emailOTP
        scope.userData.verified =true
       let url = await db.CheckUrl.create( scope.urlData );
     
    } catch (error) {
      console.log(error);
    }
  });
  it("edit check url ", async () => {
    try {
      let { body, statusCode} = await request(server).put(`/checkUrl/updateCheck/${scope.urlData.id}`)
      .send({ 
        "url":"https://www.instagram.com",
    "name":"testttt",
    "protocol":"HTTP"
        })
        .set({"authorization":`bearer ${scope.userData.token}` })
        
        expect(statusCode).to.deep.equal(200);
        expect(body.data.check).to.have.own.property("createdAt");
        expect(body).to.have.own.property("data");
        expect(body.data).to.have.own.property("check");
        expect(body.data.check).to.have.own.property("interval");
        expect(body.data.check).to.have.own.property("tags");
        expect(body.data.check).to.have.own.property("port");
        expect(body.data.check).to.have.own.property("path");
        expect(body.data.check).to.have.own.property("id");
        expect(body.data.check).to.have.own.property("assert");
        expect(body).to.have.own.property("message");
        expect(body.message).to.deep.equal("updated  successfully");

      } catch (error) {
        throw error;
      }
    });


  it("edit check url which not found this url ", async () => {
    try {
      let { body, statusCode} = await request(server).put("/checkUrl/updateCheck/2")
      .send({ 
        "url":"https://www.instagram.com",
    "name":"testttt",
    "protocol":"HTTP"
        })
        .set({"authorization":`bearer ${scope.userData.token}` })
        expect(statusCode).to.deep.equal(500);

      } catch (error) {
        throw error;
      }
    });

  

  });