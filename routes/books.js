const express = require("express");
const router = express.Router();
const Book = require("../models/books");

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
    Book.find((err, books) => {
      if (err) {
        return res.status(500);
      }
      return res.status(200).json(books);
    });
  })
  .post(verifyToken, (req, res) => {
    const book = new Book(req.body); //alternative is Book.create(req.body) => automatically includes middleware .save()
    book.save((err, book) => {
      if (err) {
        return res.status(500).end();
      } else {
        return res.status(201).json(book);
      }
    });
  });

router
  .route("/:id")
  .put(verifyToken, (req, res) => {
    const book = req.body;
    book.id = req.params.id;
    Book.findByIdAndUpdate(
      book.id,
      book,
      { new: true, runValidators: true },
      (err, book) => {
        if (err) {
          return res.status(500).end();
        }
        return res.status(202).json(book);
      }
    );
  })
  .delete(verifyToken, (req, res) => {
    // const book = req.body;
    foundId = req.params.id;
    Book.findByIdAndDelete(foundId, (err, book) => {
      if (err) {
        return res.status(500).end();
      }
      if (!book) {
        return res.status(404).end();
      }
      return res.status(202).end();
    });
  });

module.exports = router;

// const keys = Object.keys(query);
// console.log(keys);
// const filteredBooks = books.filter(book =>
//   keys.some(key => book[key] === query[key])
// );
// Book.find((err, filteredBooks) => {
//   if (err) {
//     return res.status(500);
//   }
//   return res.status(200).json(filteredBooks);
// });
// return res.status(200).json(filteredBooks);
