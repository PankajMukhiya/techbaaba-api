const mongoose = require("mongoose");
const dbUrl = process.env.DATABASE_URL;
mongoose
  .connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((data) => {
    console.log("Database Connection Successfully with", data.connection.host);
  })
  .catch((error) => {
    console.log(`The Error is:--> ${error}`);
  });
