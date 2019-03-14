const express = require("express");
const app = express();

//create middleware
const index = require("./routes/index");
const books = require("./routes/books");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", index);
app.use("/books", books);

module.exports = app;
