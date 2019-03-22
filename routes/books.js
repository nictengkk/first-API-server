const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const jwt = require("jsonwebtoken");

const secret = "My super secret message";

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.sendStatus(403);
    }
    const token = authorization.split("Bearer ")[1];
    const userData = await jwt.verify(token, secret);
    if (userData) {
      // res.status(201);
      return next();
    }
  } catch (error) {
    console.error(error.message);
    return res.status(403).json({ error: error.message });
  }
};

router
  .route("/")
  .get((req, res) => {
    // res.set("Access-Control-Allow-Origin");
    const { author, title } = req.query;

    if (title) {
      return Book.find({ title }).then(book => res.json(book));
    }

    if (author) {
      return Book.find({ author }).then(book => res.json(book));
    }

    return Book.find().then(book => res.json(book));
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
      return res.status(202).send("The book has been deleted successfully");
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
