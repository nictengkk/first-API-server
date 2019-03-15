const express = require("express");
const router = express.Router();

const books = [
  { id: "1", title: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "2", title: "Way of the Wolf", author: "Jordan Belfort" },
  { id: "3", title: "Beating the Street", author: "Peter Lynch" }
];

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(403);
  } else {
    if (authorization === "Bearer my-awesome-token") {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

router
  .route("/")
  .get((req, res) => {
    const query = req.query;
    if (Object.entries(query).length === 0) {
      res.status(200).json(books);
    } else {
      const keys = Object.keys(query);
      const filteredBooks = books.filter(book =>
        keys.some(key => book[key] === query[key])
      );
      res.status(200).json(filteredBooks);
    }
  })
  .post(verifyToken, (req, res) => {
    const book = req.body;
    book.id = "4";
    books.push(book);
    res.status(201).json(book);
  });

router
  .route("/:id")
  .put(verifyToken, (req, res) => {
    const book = req.body;
    book.id = req.params.id;
    if (book.id <= books.length) {
      res.status(202).json(book); //can be chained because res.status returns an object that requires parsing.
    } else {
      res.status(403).end();
    }
  })
  .delete((req, res) => {
    const book = req.body;
    book.id = req.params.id;
    if (book.id <= books.length) {
      res.status(202).end();
    } else {
      res.status(400).end();
    }
  });

module.exports = router;
