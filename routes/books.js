const express = require("express");
const router = express.Router();

const books = [
  { id: "1", name: "abc", author: "abcde" },
  { id: "2", name: "def", author: "defgh" },
  { id: "3", name: "ghi", author: "ghijk" }
];

router
  .route("/")
  .get((req, res) => {
    res.status(200);
    res.json(books);
  })
  .post((req, res) => {
    const book = req.body;
    book.name = "jkl";
    book.author = "jklmn";
    book.id = "4";
    res.status(201);
    res.json(book);
  });

router
  .route("/:id")
  .put((req, res) => {
    req.query.id;
    res.status(202);
  })
  .delete((req, res) => {
    res.status(202);
  });
module.exports = router;
