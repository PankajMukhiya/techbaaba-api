const jwt = require("jsonwebtoken");
const userCol = require("../db/models/userSchema");
const Authenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // console.log(token);
    // let token = await signinUserData.generateAuthToken()
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await userCol.findOne({
      _id: verifyToken._id,
      "tokens:token": token,
    });
    if (!rootUser) {
      throw new Error("User Not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    //call next
    next();
  } catch (error) {
    res.status(401).send("Unauthorized : No Token Provided... ");
    console.log(`ERROR(in authenticate middleware):-=>  ${error}`);
  }
};

module.exports = Authenticate;
