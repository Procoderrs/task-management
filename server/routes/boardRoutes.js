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
      
      '#ECF4E8',     
      '#DEDED1',
      '#FBF3D1',
      '#F5F5F0',
      '#D9E9CF',
      '#F5D2D2',
      '#CBDCEB',
      '#bae6fd',
      '#EEE6CA',
      '#FAF1E6',
      '#FEE8D9',
      '#badfdb',
      '#FEEBF6',
      '#FFEDFA',
      '#EBD6FB',
      '#C0C9EE',
      '#EBFFD8',
      '#FFDCDC',
      '#FFF2EB',
      '#ECFAE5',
      '#DDF6D2',
      '#FFD6BA',
      


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
    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
