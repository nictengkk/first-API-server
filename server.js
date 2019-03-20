const app = require("./app");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT;
const mongodbUri = process.env.MONGODB_URI;

//mongodb.connect() if you are not using mongoose wrapper
mongoose.connect(mongodbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
const db = mongoose.connection;

//db.on (on is an event listener)
db.on("error", err => {
  console.error("Unable to connect to database, err:", err);
});
db.on("connected", () => {
  console.log("Successfully connected to database");
});

//db.once runs callback function only once.
db.once("open", () => {
  const inProduction = app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server is running on heroku with PORT number ${port}`);
    } else {
      console.log(`Server is running on https://localhost:${port}`);
    }
  });
});
