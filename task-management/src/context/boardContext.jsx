// ✅ src/context/BoardContext.jsx
import React, {
	createContext,
	useReducer,
	useRef,
	useState,
	useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

// API helpers
import {
	getTasks,
	createTask,
	updateTaskApi,
	deleteTaskApi,
} from "../api/tasks";
import { getBoards, createBoardApi, deleteBoardApi } from "../api/boards";

// -------------------------------------------
// 1️⃣ Setup & constants
// -------------------------------------------
const BoardContext = createContext();
const initialState = { boards: [] };

// -------------------------------------------
// 2️⃣ Reducer
// -------------------------------------------
function boardReducer(state, action) {
	switch (action.type) {
		case "INIT":
			return { ...state, boards: action.payload || [] };
		case "ADD_BOARD":
			return { ...state, boards: [...state.boards, action.payload] };
		case "DELETE_BOARD":
			return {
				...state,
				boards: state.boards.filter((b) => b._id !== action.payload),
			};
		case "ADD_TASK": {
			const { boardId, task } = action.payload;
			return {
				...state,
				boards: state.boards.map((board) => {
					if (board._id !== boardId) return board;
					const newColumns = (board.columns || []).map((col) =>
						col.id === task.status
							? { ...col, taskIds: [...col.taskIds, task.id] }
							: col
					);
					return {
						...board,
						tasks: [...(board.tasks || []), task],
						columns: newColumns,
					};
				}),
			};
		}
		case "UPDATE_TASK": {
			const { boardId, taskId, updates } = action.payload;
			return {
				...state,
				boards: state.boards.map((board) => {
					if (board._id !== boardId) return board;
					return {
						...board,
						tasks: (board.tasks || []).map((t) =>
							t.id === taskId ? { ...t, ...updates } : t
						),
					};
				}),
			};
		}
		case "DELETE_TASK": {
			const { boardId, taskId } = action.payload;
			return {
				...state,
				boards: state.boards.map((board) => {
					if (board._id !== boardId) return board;
					return {
						...board,
						tasks: (board.tasks || []).filter((t) => t.id !== taskId),
						columns: (board.columns || []).map((col) => ({
							...col,
							taskIds: col.taskIds.filter((id) => id !== taskId),
						})),
					};
				}),
			};
		}
		case "MOVE_TASK": {
			const { boardId, taskId, newColumnId } = action.payload;
			return {
				...state,
				boards: state.boards.map((board) => {
					if (board._id !== boardId) return board;

					const newColumns = board.columns.map((col) => {
						if (col.taskIds.includes(taskId) && col.id !== newColumnId) {
							return {
								...col,
								taskIds: col.taskIds.filter((id) => id !== taskId),
							};
						}
						if (col.id === newColumnId) {
							return { ...col, taskIds: [...col.taskIds, taskId] };
						}
						return col;
					});

					const newTasks = (board.tasks || []).map((t) =>
						t.id === taskId ? { ...t, status: newColumnId } : t
					);

					return { ...board, columns: newColumns, tasks: newTasks };
				}),
			};
		}
		default:
			return state;
	}
}

// -------------------------------------------
// 3️⃣ Provider
// -------------------------------------------
function BoardProvider({ children }) {
	// ✅ Initialize user synchronously from localStorage
	const [board, setBoards] = useState([]);
	const [user, setUser] = useState(() => {
		const token = localStorage.getItem("token");
		const userData = localStorage.getItem("user");
		return token && userData ? JSON.parse(userData) : null;
	});
	const [loading, setLoading] = useState(true);

	const login = async (token, userData) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(userData));
		setUser(userData);

		// Fetch boards immediately after login
		try {
			const boardsRaw = await getBoards();
			dispatch({ type: "INIT", payload: boardsRaw });
		} catch (err) {
			console.error("Failed to load boards after login", err);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		window.location.href = "/login"; // redirect to login page
	};
	const [state, dispatch] = useReducer(boardReducer, initialState);
	const didInit = useRef(false);

	// ---------- normalize task ----------
	const normalizeTask = (taskDoc) => ({
		id: taskDoc._id || taskDoc.id || uuidv4(),
		_id: taskDoc._id || taskDoc.id || undefined,
		title: taskDoc.title,
		description: taskDoc.description || "",
		priority: (taskDoc.priority || "medium").toLowerCase(),
		dueDate: taskDoc.dueDate || null,
		tags: taskDoc.tags || [],
		status: taskDoc.status || taskDoc.columnId || "todo",
		boardId: taskDoc.boardId || null,
		createdAt: taskDoc.createdAt,
		updatedAt: taskDoc.updatedAt,
	});

	// ---------- initial load ----------
	useEffect(() => {
		if (didInit.current) return;
		didInit.current = true;

		const loadAll = async () => {
			try {
				const [boardsRaw, tasksRaw] = await Promise.all([
					getBoards(),
					getTasks(),
				]);
				console.log(boardsRaw, tasksRaw);

				const boards = boardsRaw.map((b) => ({
					...b,
					columns:
						b.columns && b.columns.length
							? b.columns
							: [
									{ id: uuidv4(), title: "Todo", taskIds: [] },
									{ id: uuidv4(), title: "In Progress", taskIds: [] },
									{ id: uuidv4(), title: "Done", taskIds: [] },
							  ],
					tasks: [],
				}));

				const normalized = (tasksRaw || []).map(normalizeTask);

				const boardsWithTasks = boards.map((board) => {
					const boardTasks = normalized.filter(
						(t) => String(t.boardId) === String(board._id)
					);
					const cols = board.columns.map((col) => ({ ...col, taskIds: [] }));
					boardTasks.forEach((t) => {
						const target = cols.find((c) => c.id === t.status) || cols[0];
						if (target) target.taskIds.push(t.id);
					});
					return { ...board, tasks: boardTasks, columns: cols };
				});

				dispatch({ type: "INIT", payload: boardsWithTasks });
			} catch (err) {
				console.error("Failed to load boards/tasks:", err);
				dispatch({ type: "INIT", payload: [] });
			} finally {
				setLoading(false);
			}
		};

		loadAll();
	}, []);

	// -------------------------------------------
	// 4️⃣ Action functions
	// -------------------------------------------
	const addBoard = async (title) => {
		try {
			const serverBoard = await createBoardApi({ title });
			const board = {
				...serverBoard,
				columns:
					serverBoard.columns && serverBoard.columns.length
						? serverBoard.columns
						: [
								{ id: uuidv4(), title: "Todo", taskIds: [] },
								{ id: uuidv4(), title: "InProgress", taskIds: [] },
								{ id: uuidv4(), title: "Done", taskIds: [] },
						  ],
				tasks: serverBoard.tasks || [],
			};
			dispatch({ type: "ADD_BOARD", payload: board });
		} catch (err) {
			console.error("Failed to create board:", err);
		}
	};

	const deleteBoard = async (id) => {
		try {
			await deleteBoardApi(id);
			dispatch({ type: "DELETE_BOARD", payload: id });
		} catch (err) {
			console.error("Failed to delete board:", err);
		}
	};

	/* const addTask = async (boardId, columnId, taskData) => {
		try {
			const payload = { ...taskData, boardId, status: columnId };
			const serverTask = await createTask(payload);


			const task = normalizeTask(serverTask);
			dispatch({ type: "ADD_TASK", payload: { boardId, task } });
			return task;
		} catch (err) {
			console.error("Failed to create task:", err);
		}
	}; */



	const addTask = async (boardId, columnId, taskData) => {
  // 1️⃣ Temporary task for UI
  const tempId = uuidv4();
  const tempTask = normalizeTask({
    ...taskData,
    _id: tempId,
    id: tempId,
    boardId,
    status: columnId,
  });
  dispatch({ type: "ADD_TASK", payload: { boardId, task: tempTask } });

  try {
    // 2️⃣ Clean payload for backend
    const payload = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      tags: taskData.tags,
      boardId,
      status: columnId, // make sure this matches backend column ID
    };

    const serverTask = await createTask(payload);
    const normalizedTask = normalizeTask(serverTask);

    // 3️⃣ Replace temp task with real task from backend
    dispatch({
      type: "UPDATE_TASK",
      payload: { boardId, taskId: tempTask.id, updates: normalizedTask },
    });

    return normalizedTask;
  } catch (err) {
    console.error("Failed to create task:", err);

    // Remove temp task on failure
    dispatch({
      type: "DELETE_TASK",
      payload: { boardId, taskId: tempTask.id },
    });
  }
};


	const updateTask = async (boardId, taskId, updates) => {
		try {
			const board = state.boards.find((b) => b._id === boardId);
			const task =
				board &&
				(board.tasks || []).find((t) => t.id === taskId || t._id === taskId);
			const serverId = task?._id || task?.id || taskId;

			const serverUpdated = await updateTaskApi(serverId, updates);
			const normalized = normalizeTask(serverUpdated);

			dispatch({
				type: "UPDATE_TASK",
				payload: { boardId, taskId: normalized.id, updates: normalized },
			});
			return normalized;
		} catch (err) {
			console.error("Failed to update task:", err);
		}
	};

	const deleteTask = async (boardId, taskId) => {
		try {
			const board = state.boards.find((b) => b._id === boardId);
			const task =
				board &&
				(board.tasks || []).find((t) => t.id === taskId || t._id === taskId);
			const serverId = task?._id || task?.id || taskId;

			await deleteTaskApi(serverId);
			dispatch({ type: "DELETE_TASK", payload: { boardId, taskId } });
		} catch (err) {
			console.error("Failed to delete task:", err);
		}
	};

	const moveTask = async (boardId, taskId, newColumnId) => {
		try {
			const board = state.boards.find((b) => b._id === boardId);
			const task =
				board &&
				(board.tasks || []).find((t) => t.id === taskId || t._id === taskId);
			const serverId = task?._id || task?.id || taskId;

			const serverUpdated = await updateTaskApi(serverId, {
				status: newColumnId,
			});
			const normalized = normalizeTask(serverUpdated);

			dispatch({
				type: "MOVE_TASK",
				payload: { boardId, taskId: normalized.id, newColumnId },
			});
		} catch (err) {
			console.error("Failed to move task:", err);
		}
	};

	// -------------------------------------------
	// 5️⃣ Expose context
	// -------------------------------------------
	return (
		<BoardContext.Provider
			value={{
				user,
				login,
				logout,
				boards: state.boards,
				addBoard,
				deleteBoard,
				addTask,
				updateTask,
				deleteTask,
				moveTask,
			}}
		>
			{children}
		</BoardContext.Provider>
	);
}

export { BoardContext, BoardProvider };