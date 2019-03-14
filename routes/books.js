const express = require("express");
const router = express.Router();

const books = [
  { name: "abc", author: "abcde" },
  { name: "def", author: "defgh" },
  { name: "ghi", author: "ghijk" }
];

router.get("/", (req, res) => {
  res.send(books);
});

module.exports = router;
