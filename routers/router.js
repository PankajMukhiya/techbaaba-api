// 3 ways to create router

const express = require("express");
// const validator = require("validator");
const bcrypt = require("bcryptjs");
// const jwt = require('jsonwebtoken');
//required these two which is below  for connection  with DB
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//database connection
require("../db/connDB");
//collection
const userColl = require("../db/models/userSchema");
const Authenticate = require("../middlewares/authenticate");

//MiddleWare
// const MiddleWare = (req, res, next) => {
//   console.log("middleware");
//   next();
// };

//1.create Router
const router = express.Router();

//2.use router
router.get("/", (req, res) => {
  res.send("Hello ! form Backend Home Page ROUTER");
  // res.cookie("test", "tsshfhs")
});
// router.get("/about", (req, res) => {
//   console.log("about");
//   res.send("Hello ! form  About Page ROUTER");
// });
router.get("/contact", (req, res) => {
  res.send("Hello ! form Backend  Contact Page ROUTER");
});

// Route: create user : '/register'
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cPassword } = req.body;
  // console.log(name);
  //vatidation
  if (!name || !email || !phone || !work || !password || !cPassword) {
    return res.status(422).json("Error: please fill the Fields properly ");
  }

  try {
    const response = await userColl.findOne({ email: email });
    // response is true it means that user exist if false then create new user
    if (response) {
      return res.status(422).json("Error: Email Already  Exist ! ");
    } else if (password != cPassword) {
      return res.status(422).json("Password is not matched ");
    } else {
      // if email not exist then create a new user
      // creating a new user
      const createUser = new userColl({
        name,
        email,
        phone,
        work,
        password,
        cPassword,
      });
      // before saving password hashing  so use middlewoare

      await createUser.save();
      res.status(201).json({ messsage: "User Register Successfully" });
      console.log("User Register Successfully");
    }
  } catch (error) {
    console.log(`ERROR(in user register) : ${error}`);
  }
});

// Route : '/signin' user
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ errorMessage: "Please fill the Data" });
    }
    const signinUserData = await userColl.findOne({ email: email }); //matching user email which is store in database
    // console.log(signinUserData)

    if (!signinUserData) {
      return res.status(400).json({ error: "Invalid Credientials " }); //not matched email
    }

    //matching signin user password
    const userSigninPassMatching = await bcrypt.compare(
      password,
      signinUserData.password
    );
    if (!userSigninPassMatching) {
      return res.status(400).json({ error: "Invalid Credientials " }); //not matched password
    }
    console.log("SignIn Successfully...  ");

    // when user signin successfully then gernerate token
    //  let token = await signinUserData.generateAuthToken()
    let token = await signinUserData.generateAuthToken();
    // console.log(`TOKEN:-->   ${token}`);

    // store token
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 2589000000),
        httpOnly: true,
      })
      .json({
        messsage: "SignIn Successfully... ",
        token: token,
      });
  } catch (error) {
    console.log(`ERROR(in user signin) : ${error}`);
  }
});

// route : "/about"
router.get("/about", Authenticate, (req, res) => {
  // console.log("about");
  res.send(req.rootUser);
});
// route : "/useralldata"  sending user all data
router.get("/useralldata", Authenticate, (req, res) => {
  console.log("about");
  res.send(req.rootUser);
});

//3.export router
module.exports = router;
