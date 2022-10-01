const express = require("express");
const dotenv = require("dotenv");
const router = require("./routers/router");
const app = express();
dotenv.config({ path: "./config.env" }); //use dotenv for secure code
const PORT = process.env.PORT || 3000;
const cookiesParser = require("cookie-parser");
const cors = require("cors");
//Database connection
require("./db/connDB");
// middleware
app.use(express.json()); // <-- convert json data into object
//cookies parser
app.use(cookiesParser());
app.use(cors());

//routing
app.use(router);
//this is the  another way  of routing
//  app.use(require("./routers/router"))

// listen
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT} `);
});
