import mongoose from "mongoose";
import Task from "./Task.js";




// 🔹 Each column (Todo, In Progress, Done)
const columnSchema = new mongoose.Schema({
  id: String,
  title: String,
  taskIds: [String],
});



// 🔹 Main board schema
const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  columns: [columnSchema],
  tasks: [
    {type:mongoose.Schema.Types.ObjectId,
      ref:'Task', },
    
  ],
  color:{type:String,default:'#fef9c3'},
  createdAt: { type: Date, default: Date.now },
});




boardSchema.pre(['findOneAndDelete', 'findByIdAndDelete'], async function (next) {
  const boardId = this.getQuery()['_id'];
  console.log("🧹 Deleting board and its tasks for:", boardId);
  if (boardId) {
    await Task.deleteMany({ boardId });
  }
  next();
});

export default mongoose.model("Board", boardSchema);



