const express = require("express");
const router = express.Router();

const books = [
  { id: "1", title: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "2", title: "Way of the Wolf", author: "Jordan Belfort" },
  { id: "3", title: "Beating the Street", author: "Peter Lynch" }
];

//authentication function
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
    const { author, title } = req.query;

    if (author) {
      const foundBooks = books.filter(book => {
        return book.author === author;
      });
      res.status(200).json(foundBooks);
    } else if (title) {
      const foundBooks = books.filter(book => {
        return book.title === title;
      });
      res.status(200).json(foundBooks);
    } else {
      res.status(200).json(books);
    }
  })
  .post(verifyToken, (req, res) => {
    const book = req.body;
    book.id = "4"; //change this to update dynamically based on db
    books.push(book);
    // add it to your db
    res.status(201).json(book);
  });

//add verifyToken fn into .post(verifyToken, (req, res))=>{})

router
  .route("/:id")
  .put((req, res) => {
    const book = req.body;
    book.title = "One Up On Wall Street";
    // book.id = req.params.id;
    // book.author = req.body.author;
    res.status(202).json(book); //can be chained because res.status returns an object that requires parsing.
  })
  .delete((req, res) => {
    const book = req.body;
    book.id = req.params.id;
    if (book.id) {
      res.status(202).end();
    } else {
      res.status(400).end();
    }
  });

module.exports = router;
