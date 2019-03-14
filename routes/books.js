const express = require("express");
const router = express.Router();

const books = [
  { id: "1", name: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "2", name: "Way of the Wolf", author: "Jordon Belfort" },
  { id: "3", name: "Beating the Street", author: "Peter Lynch" }
];

router
  .route("/")
  .get((req, res) => {
    res.status(200);
    res.json(books);
  })
  .post((req, res) => {
    const book = req.body;
    book.id = "4";
    books.push(book);
    // add it to your db
    res.status(201);
    res.json(book);
  });

router
  .route("/:id")
  .put((req, res) => {
    const book = req.body;
    book.name = "One Up On Wall Street";
    // book.id = req.params.id;
    // book.author = req.body.author;
    res.status(202).json(book); //can be chained because res.status returns an object that requires parsing.
  })
  .delete((req, res) => {
    res.status(202).end();
  });

module.exports = router;
