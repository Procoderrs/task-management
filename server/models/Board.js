import mongoose from "mongoose";




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

export default mongoose.model("Board", boardSchema);

