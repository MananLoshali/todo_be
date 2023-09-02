import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router();

//REGISTER ROUTE
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();

    const accessToken = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SEC_KEY,
      { expiresIn: "1800s" }
    );
    res
      .status(200)
      .send({ res: "User created", user: savedUser, accessToken: accessToken });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ error: "user not found" });
    } else {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: "Incorrect Password" });
      } else {
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SEC_KEY,
          { expiresIn: "1800s" }
        );
        const { password, ...others } = user._doc;

        res.status(200).send({ user: others, token: accessToken });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export default router;
