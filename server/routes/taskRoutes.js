import express from "express";
import Tasks from "../models/Task.js";

const router = express.Router();

// 🟢 Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// 🟢 Create a new task
router.post("/", async (req, res) => {
  try {
    


    // attach color to task
    const task = new Tasks({
      ...req.body
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
});

// 🟢 Update a task
router.put("/:id", async (req, res) => {
  try {
    const updated = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
});

// 🟢 Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await Tasks.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default router;
