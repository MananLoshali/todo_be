import express from "express";
import {
  verifyToken,
  verifyTokenAndAutherization,
} from "../middlewares/verifyToken.js";
import Todo from "../Models/Todo.js";

const router = express.Router();

//CREATE A NEW TODO
router.post("/create/:id", verifyTokenAndAutherization, async (req, res) => {
  const todo = await req.body.todo;
  const id = await req.user.id;
  console.log(todo);
  console.log(id);

  const newTodo = new Todo({
    userId: id,
    todo: todo,
  });
  try {
    const savedTodo = await newTodo.save();
    res.status(201).send({ msg: "todo created", todo: savedTodo });
  } catch (error) {
    res.status(500).send({ error: error, msg: "SERVER ERROR" });
  }
});

//UPDATE TODO
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    // const todos = await Todo.findById(req.params.id);
    // console.log(todos);
    console.log(req.body);
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .send({ msg: "Todo updated Successfully", updatedTodo: todo });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//DELETE A TODO
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});
//GET All TODO OF A CERTAIN USER
router.get("/getall/:id", verifyTokenAndAutherization, async (req, res) => {
  const queryNew = req.query.new;
  const queryPending = req.query.pending;
  const queryCompleted = req.query.completed;

  let todos;
  try {
    if (queryNew) {
      todos = await Todo.find({ userId: req.params.id })
        .sort({ createdAt: -1 })
        .limit(2);
    } else if (queryPending) {
      let todo = await Todo.find({ userId: req.params.id });
      todos = todo.filter((item) => item.isCompleted === false);
    } else if (queryCompleted) {
      let todo = await Todo.find({ userId: req.params.id });
      todos = todo.filter((item) => item.isCompleted === true);
    } else {
      todos = await Todo.find({ userId: req.params.id });
    }
    res.status(200).send({ msg: "todo fetched successfully", todos: todos });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});
export default router;
