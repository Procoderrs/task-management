// routes/boardRoutes.js
import express from "express";
import Board from "../models/Board.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all boards
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get board by ID
router.get("/:id", async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('tasks');
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new board
router.post("/", async (req, res) => {

  try {
    const lightColor=[
      
      "#e9d5ff", "#bae6fd", "#bfdbfe", "#c7d2fe", "#E1E9C9",
    '#FEEBF6', '#F4F8D3',  ,'#FFEDFA',
   , '#EDE8DC',,'#FEFAE0','#FFEAA7','#F5EEE6', 

   '#EADCF8', '#d7eaf3','#fadadd','#dff6e6','#ffe8d6','#e3f2fd','#f3e5f5','#fff8e7','#fce4ce','#e0f7fa',
   

    

    ];
      const randomColor=lightColor[Math.floor(Math.random()*lightColor.length)];
    const {title}=req.body;
    const defaultColumns=[
      {id:new mongoose.Types.ObjectId(),title:'Todo',taskIds:[]},
      {id:new mongoose.Types.ObjectId(),title:'InProgress',taskIds:[]},
      {id:new mongoose.Types.ObjectId(),title:'Done',taskIds:[]},
    ];

    const board = new Board({title,columns:defaultColumns,color:randomColor,});
    const savedBoard = await board.save();
    res.status(201).json(savedBoard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update board
router.put("/:id", async (req, res) => {
  try {
    const updated = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete board
router.delete("/:id", async (req, res) => {
  try {
    await Board.findByIdAndDelete({_id:req.params.id});
    res.json({ message: "Board and its task  deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
