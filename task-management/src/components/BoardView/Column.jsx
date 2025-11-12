import React, { useState, useContext, useRef, useEffect } from "react";
import TaskCard from "./TaskCard";
import { BoardContext } from "../../context/boardContext";

const Column = ({ column, tasks = [], board, isFiltered }) => {
  const { addTask } = useContext(BoardContext);
  const [showInput, setShowInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const inputRef = useRef(null); // Ref for input

  if (!column || !column.id) return null;

  const tasksToRender = Array.isArray(tasks) ? tasks : [];

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    // Add task via context
    await addTask(board._id, column.id, {
      title: newTaskTitle,
      description: "",
      priority: "low",
      tags: [],
    });

    // Clear input but keep it open
    setNewTaskTitle("");
    setShowInput(true);

    // Auto-focus input after adding
    inputRef.current?.focus();
  };

  // Auto-focus input when first opened
  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow min-h-[200px] flex flex-col">
      <h3 className="font-bold mb-2 text-gray-700">{column.title || "Column"}</h3>

      <div className="space-y-3 flex-1">
        {tasksToRender.map(
          (task) =>
            task && task.id && (
              <TaskCard
                key={task.id}
                task={task}
                boardId={board._id}
                isFiltered={isFiltered}
              />
            )
        )}

        {/* Input for new task */}
        {(showInput || tasksToRender.length === 0) && (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              ref={inputRef} // attach ref
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border px-2 py-1 rounded w-full outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setNewTaskTitle("");
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Show "Add Task" prompt if input is hidden */}
        {!showInput && tasksToRender.length > 0 && (
          <p
            className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
            onClick={() => setShowInput(true)}
          >
            + Add a task
          </p>
        )}
      </div>
    </div>
  );
};

export default Column;
