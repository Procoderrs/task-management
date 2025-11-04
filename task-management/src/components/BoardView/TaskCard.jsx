// src/components/BoardView/TaskCard.jsx
import React, { useEffect, useState } from "react";
import TaskModal from "./TaskModal";
import { useDraggable } from "@dnd-kit/core";
import { getRandomLightColor } from "../../utils/getRandomColor";
/**
 * TaskCard (fixed):
 * - setNodeRef on the container
 * - listeners/attributes only on the small drag handle
 * - click on card opens modal (safe)
 */

const TaskCard = ({ task, boardId, isFiltered }) => {

  const [bgColor,setBgColor]=useState(task.color || getRandomLightColor())

  useEffect(()=>{
    if(!task.color){
      setBgColor(getRandomLightColor());
    }
  },[task.color])

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { boardId, taskId: task.id },
  });

  // correct transform string (no extra space)
 // 💡 combine transform and task color
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    backgroundColor:bgColor,
   
     // fallback to white if color missing
    
  };
  


  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        ref={setNodeRef}                     // node ref for dnd
        style={style}
        className={`p-3 rounded border shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.02] ${
    isFiltered ? "animate-glow" : "cursor-pointer"
  }`}
  onClick={() => setOpen(true)}       // open modal on card click
      >
       
 <div className="flex items-start justify-between  "   >
          <div className="flex-1 pr-2 overflow-hidden text-wrap " >
            <div className="font-bold text-xl  mb-1"> <span className="text-base text-gray-700">Title: </span>{task.title.toUpperCase()}</div>
            {task.description && (
              <div className="">
     <p className="text-gray-700 mb-1  text-wrap ">
  {task.description}
   </p>
              </div>
            )}
            {task.dueDate && (
              <div className="text-gray-600 text-xs mb-1">
                📅 {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            <div className="text-xs text-gray-500 mb-2">
              Priority:{" "}
              <span
                className={
                  task.priority === "High"
                    ? "text-red-600 font-semibold"
                    : task.priority === "medium"
                    ? "text-yellow-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {task.priority}
              </span>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Drag handle (only this element receives listeners) ---------- */}
          <button
            type="button"
            className="ml-2 p-2 rounded hover:bg-gray-100 active:bg-gray-200 cursor-grab active:cursor-grabbing"
            // attach DnD listeners AND attributes here
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()} // prevent opening modal when user clicks handle
            aria-label="Drag handle"
            title="Drag"
          >
            {/* simple icon — three horizontal lines */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
       
       </div>
      </div>

      {open && <TaskModal task={task} boardId={boardId} onClose={() => setOpen(false)} />}
    </>
  );
};

export default TaskCard;
