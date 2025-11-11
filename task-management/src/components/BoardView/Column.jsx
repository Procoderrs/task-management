import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ column, tasks = [], board, isFiltered }) => {
  if (!column || !column.id) return null;

  const tasksToRender = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow min-h-[200px]">
      <h3 className="font-bold mb-2 text-gray-700">{column.title || "Column"}</h3>
      <div className="space-y-3">
        {tasksToRender.length > 0 ? (
          tasksToRender.map((task) =>
            task && task.id ? (
              <TaskCard
                key={task.id}
                task={task}
                boardId={board._id}
                isFiltered={isFiltered}
              />
            ) : null
          )
        ) : (
          <p className="text-gray-400 text-sm">No tasks</p>
        )}
      </div>
    </div>
  );
};

export default Column;
