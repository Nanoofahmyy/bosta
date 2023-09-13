
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
    password: "123456789",
    username:"test",
    phoneNumber:"01117393336" ,
    verified:true,
    token: ""
     },
     userData2: {
        email: "nanoo.fahmy@agel.io",
        password: "123456789",
        username:"test",
        phoneNumber:"01117393333" ,
        verified:false,
        token: ""
         },
 };
describe("TESTING User", () => {
  before(async () => {
    console.log("sync in test  ", process.env.NODE_ENV);
    try {
      await db.sequelize.sync({ force: true });
      console.log("db connected");
    const hashedPassword = bcrypt.hashSync(scope.userData.password, 8); 
       const user = await db.User.create({
          email: scope.userData.email,
          password: hashedPassword,
          phoneNumber:  scope.userData.phoneNumber, 
          username: scope.userData.username,
          verified:true
        });
        const hashedPassword2 = bcrypt.hashSync(scope.userData2.password, 8);
        const user2 = await db.User.create({
            email: scope.userData2.email,
            password: hashedPassword2,
            phoneNumber: scope.userData2.phoneNumber, 
            username: scope.userData2.username,
            verified:false
          });
      
     
    } catch (error) {
      console.log(error);
    }
  });

  it("login with valid email and password", async () => {
    try {
      let { body, statusCode} = await request(server).post("/user/login/")
      .send({ email: scope.userData.email, password: scope.userData.password }) 
        expect(statusCode).to.deep.equal(200);
        expect(body).to.have.own.property("message");
        expect(body).to.have.own.property("phoneNumber");
        expect(body).to.have.own.property("token");
        expect(body.message).to.deep.equal("User login successfully");
      } catch (error) {
        throw error;
      }
    });

    it("login with invalid email and password", async () => {
        try {
          let { body, statusCode} = await request(server).post("/user/login/")
          .send({ email: "docnanoo2000@gmail.com", password: scope.userData.password }) 
            expect(statusCode).to.deep.equal(401);
            expect(body).to.have.own.property("message");
            expect(body.message).to.deep.equal("Invalid email");
          } catch (error) {
            throw error;
          }
        });
        it("login with valid email and invalid password", async () => {
            try {
              let { body, statusCode} = await request(server).post("/user/login/")
              .send({ email: scope.userData.email, password: "scope.userData.password" }) 
                expect(statusCode).to.deep.equal(401);
                expect(body).to.have.own.property("message");
                expect(body.message).to.deep.equal("Invalid Password!");
              } catch (error) {
                throw error;
              }
            });

            it("login with valid email and invalid password", async () => {
                try {
                  let { body, statusCode} = await request(server).post("/user/login/")
                  .send({ email: "docn@gmail.com", password: "scope.userData.password" }) 
                    expect(statusCode).to.deep.equal(401);
                    expect(body).to.have.own.property("message");
                    expect(body.message).to.deep.equal("Invalid email");
                  } catch (error) {
                    throw error;
                  }
                });

                it("login with not valified email", async () => {
                    try {
                      let { body, statusCode} = await request(server).post("/user/login/")                 
                      .send({ email: scope.userData2.password, password: scope.userData2.password }) 
                        expect(statusCode).to.deep.equal(401);
                        expect(body).to.have.own.property("message");
                        expect(body.message).to.deep.equal("Invalid email");
                      } catch (error) {
                        throw error;
                      }
                    });
  

  });