
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
  it("delete check url ", async () => {
    try {
      let { body, statusCode} = await request(server).delete(`/checkUrl/deleteCheck/${scope.urlData.id}`)
        .set({"authorization":`bearer ${scope.userData.token}` })
        
        expect(statusCode).to.deep.equal(200);
        expect(body).to.have.own.property("status");
        expect(body).to.have.own.property("message");
        expect(body.message).to.deep.equal("deleted  successfully");

      } catch (error) {
        throw error;
      }
    });


  it("delete check url which not found this url ", async () => {
    try {
      let { body, statusCode} = await request(server).put("/checkUrl/deleteCheck/2")
        .set({"authorization":`bearer ${scope.userData.token}` })

        expect(statusCode).to.deep.equal(404);

      } catch (error) {
        throw error;
      }
    });

  

  });