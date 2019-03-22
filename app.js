const express = require("express");
const app = express();

//create middleware
const index = require("./routes/index");
const books = require("./routes/books");

// const cors = (req, res, next) => {
//     res.set("Access-Control-Allow-Origin", *);
//     next();
// }

// app.use("/", cors);

app.use(express.static("public")); //always hard reload after adding favicon.ico (renaming)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", index);
app.use("/api/v1/books", books);

module.exports = app;
