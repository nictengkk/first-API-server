//{ id: "1", title: "The Intelligent Investor", author: "Benjamin Graham" }

//model naming convention is Singular, collection naming convention is plural

const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: String,
  author: String
});
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
