import React, { useState, useContext } from "react";
import { BoardContext } from "../../context/boardContext";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { getRandomLightColor } from "../../utils/getRandomColor";
/**
 * Column:
 * - Shows all tasks in a specific column
 * - If filter is active, shows filtered overlay
 */
const Column = ({ board, column, tasks, isFiltered }) => {
	console.log("🔍 Board received in BoardView:", board);

	const { setNodeRef } = useDroppable({ id: column.id });
	const { addTask } = useContext(BoardContext);
	const [title, setTitle] = useState("");
	const [adding, setAdding] = useState(false);

	const getTaskById = (id) => (board.tasks || []).find((t) => t.id === id);

	const handleAdd = (e) => {
		e.preventDefault();
		const trimmed = title.trim();
		if (!trimmed) return;

		addTask(board._id, column.id, {
			title: trimmed,
			description: "",
			priority: "medium",
			dueDate: null,
			tags: [],
			status: column.id,
			color: getRandomLightColor(),
		});

		setTitle("");
		setAdding(false);
	};

	return (
		<div
			ref={setNodeRef}
			className="bg-gradient-to-br from-pink-50 to-purple-50 border-4 border-zinc-600 p-3  rounded relative overflow-hidden"
		>
			{/* ---------- COLUMN HEADER ---------- */}
			<div className="flex items-center justify-between mb-4 border-b border-dashed  pb-2">
				<h3 className="font-semibold  text-2xl">{column.title} </h3>
				<span className="text-sm text-gray-500">{column.taskIds.length}</span>
			</div>

			{/* ---------- DEFAULT TASK LIST ---------- */}
			<div className="space-y-2 ">
				{column.taskIds.map((taskId) => {
					const task = getTaskById(taskId);
					if (!task) return null;
					return (
						<TaskCard
							key={task.id}
							task={task}
							boardId={board._id}
							isFiltered={false}
						/>
					);
				})}
			</div>

			{/* ---------- FILTERED OVERLAY ---------- */}
			{isFiltered && (
				<div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-3 rounded z-10 border border-blue-300 shadow-lg overflow-y-auto max-h-full transition-all duration-300 ease-in-out">
					{tasks.length > 0 ? (
						<>
							<p className="text-sm text-blue-700 font-semibold mb-2">
								Filtered Tasks ({tasks.length})
							</p>
							{tasks.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									boardId={board._id}
									isFiltered={true}
								/>
							))}
						</>
					) : (
						<p className="text-gray-500 text-center mt-10">
							No matching tasks found
						</p>
					)}
				</div>
			)}

			{/* ---------- ADD TASK ---------- */}
			{adding ? (
				<form onSubmit={handleAdd} className="mt-3">
					<input
						className="w-full p-2 rounded border outline-none"
						placeholder="Task title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						autoFocus
					/>
					<div className="flex gap-2 mt-2">
						<button
							type="submit"
							className="px-6 py-1 bg-blue-600 text-white rounded"
						>
							Add
						</button>
						<button
							type="button"
							onClick={() => {
								setAdding(false);
								setTitle("");
							}}
							className="px-3 py-1 border rounded bg-red-600 text-white"
						>
							Cancel
						</button>
					</div>
				</form>
			) : (
				<button
					className="mt-3  text-purple-900 text-lg  rounded  p-3"
					onClick={() => setAdding(true)}
				>
					+ Add task
				</button>
			)}
		</div>
	);
};

export default Column;
