var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

const isAuthenticated = require("../middleware/isAuthenticated");

const saltRounds = 10;

// -------------- Sign Up ------------------
router.post("/signup", (req, res, next) => {
  console.log("Line 15 - Received request body:", req.body);

  const { name, lastname, email, telephone, password, admin } = req.body;

  if (
    email === "" ||
    password === "" ||
    name === "" ||
    lastname === "" ||
    telephone === ""
  ) {
    res.status(400).json({ success: false, msg: "All fields required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res
      .status(400)
      .json({ success: false, msg: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ success: false, msg: "User already exists" });
        return;
      }
      console.log("Line 51 - Password value before hashing:", password);

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      User.create({
        name,
        lastname,
        email,
        telephone,
        admin,
        password: hashedPassword,
      }).then((createdUser) => {
        const { name, lastname, email, telephone, admin, _id } = createdUser;
        const user = { name, lastname, email, telephone, admin, _id };
        res.status(201).json({ success: true, user });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, msg: "Internal Server Error" });
    });
  console.log("Line 73 - Received request body:", req.body);
});

// -------------- Log In ------------------
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res
      .status(400)
      .json({ success: false, msg: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { name, lastname, email, telephone, admin, _id } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { name, lastname, email, telephone, admin, _id };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ success: true, authToken });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "Unable to authenticate the user" });
      }
    })
    .catch((err) =>
      res.status(500).json({ success: false, msg: "Internal Server Error" })
    );
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.user", req.user);

  res.status(200).json(req.user);
});

module.exports = router;
