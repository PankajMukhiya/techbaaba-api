const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    minlength: [3, "Name is too short"],
    maxlength: 26,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "Email is already present"],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    require: [true, "What is your contact number"],
    trim: true,
  },
  work: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  cPassword: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

// passward hashing (using midleware)
userSchema.pre("save", async function (next) {
  // console.log("from bcrypt");
  try {
    if (this.isModified("password")) {
      // const salt = bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, 12);
      this.cPassword = await bcrypt.hash(this.cPassword, 12);
    }
    next();
  } catch (error) {
    console.log(error);
  }
});

//Generating Token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY); //generated token
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token
  } catch (error) {
    console.log(`ERROR(in generating token): ${error}`);
  }
};



//creating collection
const userColl = new mongoose.model("user", userSchema);

module.exports = userColl;
