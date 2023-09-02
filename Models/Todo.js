import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    todo: {
      type: String,
      required: true,
      unique: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todos", todoSchema);
export default Todo;
