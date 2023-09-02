import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "todo_database",
    });
    console.log("database connected");
  } catch (error) {
    console.log("error", error);
  }
};
