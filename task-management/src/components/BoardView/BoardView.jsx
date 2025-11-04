// src/components/BoardView/BoardView.jsx
import  { useState, useContext, useMemo } from "react";
import { BoardContext } from "../../context/boardContext";
import Column from "./Column";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
} from "@dnd-kit/core";

const BoardView = ({ board }) => {
  const { moveTask } = useContext(BoardContext);
  console.log('id from boardview',board._id);

  const [searchText, setSearchText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeDragItem, setActiveDragItem] = useState(null); // for overlay if needed

  const isFiltered =
    searchText.trim() !== "" || selectedPriority !== "" || selectedTag !== "";

  const filteredTasks = useMemo(() => {
    if (!isFiltered) return [];
    return (board.tasks || []).filter((task) => {
      const matchTitle = task.title.toLowerCase().includes(searchText.toLowerCase());
      const matchPriority =
        !selectedPriority || (task.priority && task.priority.toLowerCase() === selectedPriority.toLowerCase());
      const matchTag =
        !selectedTag ||
        (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase())));
      return matchTitle && matchPriority && matchTag;
    });
  }, [board.tasks, searchText, selectedPriority, selectedTag, isFiltered]);

  // correct sensors setup
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event) => {
    setActiveDragItem(event.active.data?.current || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;
    if (active.id === over._id) return;

    const taskId=active.id;
    const newColumnId=over.id;

  console.log("🎯 Moving Task:", taskId, "→", newColumnId);

    // moveTask(boardId, taskId, newColumnId)
    moveTask(board._id, taskId, newColumnId);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-4">
        {/* filters UI (unchanged) */}
        <div className="flex flex-wrap gap-2 items-center mb-4 ">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-4 border-zinc-600  px-8  py-3.5 rounded w-56 outline-none"
          />
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className=" px-8  py-4 border-4 border-zinc-600 rounded">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="text"
            placeholder="Tag..."
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className=" px-8 border-4  py-3.5 border-zinc-600 rounded w-40"
          />
          <button
            onClick={() => {
              setSearchText("");
              setSelectedPriority("");
              setSelectedTag("");
            }}
            className="ml-auto px-3 py-3 bg-yellow-700 hover:bg-yellow-300 text-white rounded text-sm font-medium"
          >
            Clear Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {board.columns.map((column) => (
            
            <Column
              key={column.id}
              board={board}
              column={column}
              tasks={isFiltered ? filteredTasks.filter((t) => t.status === column.id) : []}
              isFiltered={isFiltered}
            />
          ))}
        </div>
      </div>

      
    </DndContext>
  );
};

export default BoardView;
