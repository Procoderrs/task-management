import React, { useContext, useState } from "react";
import { BoardContext } from "../../context/boardContext";

/**
 * TaskModal
 * - props:
 *    - task: task object to edit
 *    - boardId: id of the board this task belongs to
 *    - onClose: callback to hide modal
 *
 * UI effects:
 * - Shows an editable form with title, description, priority, dueDate, tags
 * - Save calls updateTask(boardId, task.id, updates)
 * - Delete calls deleteTask(boardId, task.id)
 *
 * Where this UI hits:
 * - updateTask / deleteTask are functions provided by BoardContext (defined in BoardContext.jsx)
 */

const TaskModal = ({ task, boardId, onClose }) => {
	const { updateTask, deleteTask } = useContext(BoardContext);

	//Local form state initally seeded from `task`
	const [title, setTitle] = useState(task.title || "");
	const [description, setDescription] = useState(task.description || "");
	const [priority, setPriority] = useState(task.priority || "");
	const [dueDate, setDueDate] = useState(task.dueDate || "");
	const [tagsText, setTagsText] = useState((task.tags || []).join(", "));

	//build updates objects and call context updater

	const handleSave = (e) => {
		e.preventDefault();
		const updates = {
			title: title.trim(),
			description: description.trim(),
			priority,
			dueDate: dueDate || null,
			tags: tagsText
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
		};

		//Call:context function=> this will dispatch UPDATE_TASK IN REDUCER

		updateTask(boardId, task.id, updates);

		//close modal after save
		onClose();
	};

	//Delete flow:Call context delete task than close
	const handleDelete = () => {
		if (window.confirm("delete this task?")) {
			//CALL context function= --> Dispatch delete task
			deleteTask(boardId, task.id);
			onClose();
		}
	};

	return (
		//backdrop+modal
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<form
				onSubmit={handleSave}
				className="bg-white p-6 rounded-lg w-full max-w-2xl"
			>
				<h2 className="text-lg font-semibold shadow-lg w-full. max-w-2xl">
					Edit Task
				</h2>
				<label className="block text-sm mb-1">Title</label>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full p-2 border rounded mb-3"
				/>

				<label className="block text-sm mb-1">Description</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={4}
					className="w-full p-2 border rounded mb-3"
				/>
				<div className="grid grid-cols-3 gap-3 mb-3">
					<div>
						<label className="text-sm block mb-1"> Priority</label>
						<select
							value={priority}
							onChange={(e) => setPriority(e.target.value)}
							className="w-full p-2 rounded border"
						>
							<option value="High">High</option>
							<option value="medium">medium</option>
							<option value="low">low</option>
						</select>
					</div>

					<div>
						<label className="text-sm block mb-1">Due Date</label>
						<input
							type="date"
							value={dueDate || ""}
							onChange={(e) => setDueDate(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div>
						<label className="text-sm block mb-1">Tags (comma)</label>
						<input
							value={tagsText}
							onChange={(e) => setTagsText(e.target.value)}
							placeholder="tag1,  tag2"
							className="w-full p-2 border rounded"
						/>
					</div>
				</div>

				<div className="flex justify-between items-center mt-4">
					<div className="flex gap-2">
						<button
							type="submit"
							className="px-3 py-2 cursor-pointer bg-blue-600 text-white rounded"
						>
							Save
						</button>
					</div>

					<button type="button" onClick={handleDelete} className="text-red-600">
						Delete
					</button>
				</div>
			</form>
		</div>
	);
};

export default TaskModal;
