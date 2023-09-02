import express from "express";
import User from "../Models/User.js";
import {
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";

const router = express.Router();

//GET A USER
router.get("/getuser/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).send({ user: others });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//GET ALL USERS
router.get("/getallusers", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ users: users });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//UPDATE A USER
router.put("/update/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        // username: req.body.username,
        // email: req.body.email,
        // password: req.body.password,
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//DELETE A USER
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "user deleted" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export default router;
