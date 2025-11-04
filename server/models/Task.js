 import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, default: "medium" },
  dueDate: Date,
  tags: [String],
  status: { type: String, default: "Todo" },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },

}, 

{ timestamps: true });

export default mongoose.model("Task", taskSchema); 