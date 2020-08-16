const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//import routes
const authRouth = require("./routes/auth");

app.use(express.json());
dotenv.config();

//connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log("Connected to DB")
);

//route middleware
app.use("/api/user", authRouth);

app.listen(process.env.PORT, () => {
  return console.log(`App listening on port ${process.env.PORT}`);
});