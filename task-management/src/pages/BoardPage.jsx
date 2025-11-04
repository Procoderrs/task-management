// src/pages/BoardPage.jsx
import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { BoardContext } from "../context/boardContext";
import BoardView from "../components/BoardView/BoardView";

const BoardPage = () => {
  const { id } = useParams();
  const { boards } = useContext(BoardContext);

  // ✅ Fix: Convert ObjectId and id to strings for comparison
  const board = boards.find(b => String(b._id) === String(id) || String(b.id) === String(id));

  // ✅ Debug logs to verify what’s happening
  console.log("🔍 URL id:", id);
  console.log("📋 Boards list:", boards);
  console.log("🎯 Found board:", board);

  if (!board) {
    return (
      <div className="p-6">
        <p className="text-red-500">Board not found.</p>
        <Link to="/" className="text-blue-600 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-4 border-b-4 border-zinc-600  rounded   py-4 px-3">
        <h1 className="text-2xl font-black text-purple-900"> <span className="text-xl text-gray-600">Board name:</span> {board.title.toUpperCase()} Task 📚</h1>
        <Link to="/" className="text-sm text-white  border px-5 py-3 rounded bg-blue-900 hover:bg-blue-500  ">
          ← Back
        </Link>
      </div>

      {/* ✅ Pass the found board to BoardView */}
      <BoardView board={board} />
    </div>
  );
};

export default BoardPage;
