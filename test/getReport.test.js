
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
  tags: [ 'Tag' ],
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
   },
    reportData : {
      "id": 1,
      "status": "up",
      "availability": null,
      "outages": 0,
      "downtime": 0,
      "uptime": 0,
      "responseTime": 1476,
      "history": null,
      "createdAt": "2023-09-13T00:59:14.143Z",
      "updatedAt": "2023-09-13T00:59:14.143Z",
      "CheckUrlId": null
  },
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
        scope.userData.emailOTP=body.data.emailOTP
        scope.userData.verified =true
       const url =await  db.CheckUrl.create( scope.urlData );
       scope.reportData.CheckUrlId=url.id
       const report =await  db.Report.create( scope.reportData );
     
    } catch (error) {
      console.log(error);
    }
  });

  it("get report ", async () => {
    try {
      let { body, statusCode} = await request(server).get("/report/getAllReport")
        .set({"authorization":`bearer ${scope.userData.token}` })
        
        expect(statusCode).to.deep.equal(200);
        expect(body.data.reports[0]).to.have.own.property("createdAt");
        expect(body).to.have.own.property("data");
        expect(body.data).to.have.own.property("reports");
        expect(body.data.reports[0]).to.have.own.property("name");
        expect(body.data.reports[0]).to.have.own.property("tags");
        expect(body.data.reports[0]).to.have.own.property("port");
        expect(body.data.reports[0]).to.have.own.property("path");
        expect(body.data.reports[0]).to.have.own.property("id");
        expect(body.data.reports[0]).to.have.own.property("Reports");
        expect(body.data.reports[0].Reports[0]).to.have.own.property("id");
        expect(body).to.have.own.property("message");
        expect(body.message).to.deep.equal("get all reports successfully");
      } catch (error) {
        throw error;
      }
    });

    it("get report by id", async () => {
      try {
        let { body, statusCode} = await request(server).get(`/report/getAllReport/${1}`)
          .set({"authorization":`bearer ${scope.userData.token}` })

          expect(statusCode).to.deep.equal(200);
          expect(body.data.report[0]).to.have.own.property("createdAt");
          expect(body).to.have.own.property("data");
          expect(body.data).to.have.own.property("report");
          expect(body.data.report[0]).to.have.own.property("status");
          expect(body.data.report[0]).to.have.own.property("availability");
          expect(body.data.report[0]).to.have.own.property("history");
          expect(body.data.report[0]).to.have.own.property("responseTime");
          expect(body).to.have.own.property("message");
          expect(body.message).to.deep.equal("get reports by id successfully");
        } catch (error) {
          throw error;
        }
      });

      it("get report by tag", async () => {
        try {
          let { body, statusCode} = await request(server).get(`/report/getAllReport/Tag`)
            .set({"authorization":`bearer ${scope.userData.token}` })
            
            console.log("🚀 ~ file: getReport.test.js:72 ~ it ~ userData:", body.data)
            expect(body.data.reports[0]).to.have.own.property("createdAt");
            expect(body).to.have.own.property("data");
            expect(body.data).to.have.own.property("reports");
            expect(body.data.reports[0]).to.have.own.property("name");
            expect(body.data.reports[0]).to.have.own.property("tags");
            expect(body.data.reports[0]).to.have.own.property("port");
            expect(body.data.reports[0]).to.have.own.property("path");
            expect(body.data.reports[0]).to.have.own.property("id");
            expect(body.data.reports[0]).to.have.own.property("Reports");
            expect(body.data.reports[0].Reports[0]).to.have.own.property("id");
            expect(body).to.have.own.property("message");
            expect(body.message).to.deep.equal("get checks by tags successfully");
          } catch (error) {
            throw error;
          }
        });
  

 

  });