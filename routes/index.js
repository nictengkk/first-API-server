const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

const secret = "My super secret message";

router
  .route("/token")
  .get(async (req, res) => {
    const userData = { _id: 123 };
    const expiresIn24hour = { expiresIn: "24h" };
    const token = await jwt.sign(userData, secret, expiresIn24hour);
    return res.status(200).json({ token });
    // res.send("Welcome to the HomePage");
  })
  .post(async (req, res) => {
    try {
      if (!req.headers.authorization) {
        res.sendStatus(403);
      }
      const token = req.headers.authorization.split("Bearer ")[1];
      const userData = await jwt.verify(token, secret);
      return res.status(203).json(userData); //userData is an object
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  });

router.route("/register").post(async (req, res) => {
  try {
    const user = new User(req.body);
    await User.init(); //does the indexing to ensure uniqueness of collection.
    await user.save();
    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: error.message });
  }
});

router.route("/").get((req, res) => {
  res.sendStatus(200);
});

module.exports = router;
