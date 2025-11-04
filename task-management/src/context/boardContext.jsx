// ✅ src/context/BoardContext.jsx
import React, { createContext, useReducer, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// API helpers we just created
import { getTasks, createTask, updateTaskApi, deleteTaskApi } from "../api/tasks";
import { getBoards, createBoardApi, deleteBoardApi } from "../api/boards";

// -------------------------------------------
// 1️⃣ Setup & constants
// -------------------------------------------
const BoardContext = createContext();
const initialState = { boards: [] }; // each board: {_id, title, columns: [{id,title,taskIds}], tasks: [{id,...}]}

// NOTE: server model fields assumed:
// - Board documents: _id, title, ... (we keep columns client-side for now)
// - Task documents: _id, title, description, priority, dueDate, tags (array), status (column id), boardId

// -------------------------------------------
// 2️⃣ Reducer (pure, synchronous state updates)
// -------------------------------------------
function boardReducer(state, action) {
  switch (action.type) {
    // initialize all boards (boards should include .tasks array already attached by loader)
    case "INIT":
      return { ...state, boards: action.payload || [] };

    // add board (server returned object)
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.payload] };

    // delete board by _id
    case "DELETE_BOARD":
      return { ...state, boards: state.boards.filter(b => b._id !== action.payload) };

    // add task object (task must include id or _id normalized to id)
    case "ADD_TASK": {
      const { boardId, task } = action.payload;
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board._id !== boardId) return board;

          // ensure columns exist: if a status references a non-existing column
          const newColumns = (board.columns || []).map(col =>
            col.id === task.status ? { ...col, taskIds: [...col.taskIds, task.id] } : col
          );

          return {
            ...board,
            tasks: [...(board.tasks || []), task],
            columns: newColumns,
          };
        })
      };
    }

    // update task
    case "UPDATE_TASK": {
      const { boardId, taskId, updates } = action.payload;
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board._id !== boardId) return board;
          return {
            ...board,
            tasks: (board.tasks || []).map(t => t.id === taskId ? { ...t, ...updates } : t)
          };
        })
      };
    }

    // delete task
    case "DELETE_TASK": {
      const { boardId, taskId } = action.payload;
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board._id !== boardId) return board;
          return {
            ...board,
            tasks: (board.tasks || []).filter(t => t.id !== taskId),
            columns: (board.columns || []).map(col => ({ ...col, taskIds: col.taskIds.filter(id => id !== taskId) }))
          };
        })
      };
    }

    // move task between columns (keep reducer id-based)
    case "MOVE_TASK": {
      const { boardId, taskId, newColumnId } = action.payload;
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board._id !== boardId) return board;

          const newColumns = board.columns.map(col => {
            if (col.taskIds.includes(taskId) && col.id !== newColumnId) {
              return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            }
            if (col.id === newColumnId) {
              return { ...col, taskIds: [...col.taskIds, taskId] };
            }
            return col;
          });

          const newTasks = (board.tasks || []).map(t => t.id === taskId ? { ...t, status: newColumnId } : t);

          return { ...board, columns: newColumns, tasks: newTasks };
        })
      };
    }

    default:
      return state;
  }
}

// -------------------------------------------
// 3️⃣ Provider: handles side-effects (API calls) and dispatches to reducer
// -------------------------------------------
function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const didInit = useRef(false);

  // ---------- helper: normalize task returned by backend ----------
  const normalizeTask = (taskDoc) => {
    // backend gives _id; UI code expects id
    return {
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
    };
  };

  // ---------- initial load: fetch boards AND tasks, then attach tasks to boards ----------
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const loadAll = async () => {
      try {
        // fetch boards and tasks in parallel
        const [boardsRaw, tasksRaw] = await Promise.all([getBoards(), getTasks()]);

        // normalize boards: ensure each board has columns (client-side) and tasks array
        const boards = boardsRaw.map(b => ({
          ...b,
          // keep server _id, but ensure columns exist client-side if not present
          columns: b.columns && b.columns.length ? b.columns : [
            { id: uuidv4(), title: "Todo", taskIds: [] },
            { id: uuidv4(), title: "In Progress", taskIds: [] },
            { id: uuidv4(), title: "Done", taskIds: [] },
          ],
          tasks: []
        }));

        // normalize tasks and attach to boards by boardId
        const normalized = (tasksRaw || []).map(normalizeTask);

        // attach tasks to the relevant board and push their id into matching column.taskIds (if possible)
        const boardsWithTasks = boards.map(board => {
          const boardTasks = normalized.filter(t => String(t.boardId) === String(board._id));
          // build mapping from column id -> column
          const cols = board.columns.map(col => ({ ...col, taskIds: [] }));

          // if tasks have status matching a column id, add them; else put them in first column
          boardTasks.forEach(t => {
            const target = cols.find(c => c.id === t.status) || cols[0];
            if (target) target.taskIds.push(t.id);
          });

          return { ...board, tasks: boardTasks, columns: cols };
        });

        dispatch({ type: "INIT", payload: boardsWithTasks });
        console.log("✅ loaded boards+tasks from backend");
      } catch (err) {
        // If fetching fails, you can fallback to empty state or local data
        console.error("Failed to load boards/tasks:", err);
        dispatch({ type: "INIT", payload: [] });
      }
    };

    loadAll();
  }, []);

  // -------------------------------------------
  // 4️⃣ Action functions — call APIs then dispatch
  // -------------------------------------------

  // CREATE BOARD (server-side)
  const addBoard = async (title) => {
    try {
      const serverBoard = await createBoardApi({ title });
      // serverBoard should include _id; we also ensure columns/tasks defaults
      const board = {
        ...serverBoard,
        columns: serverBoard.columns && serverBoard.columns.length ? serverBoard.columns : [
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

  // DELETE BOARD (server)
  const deleteBoard = async (id) => {
    try {
      await deleteBoardApi(id);
      dispatch({ type: "DELETE_BOARD", payload: id });
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  // CREATE TASK: send to server, then add to client state
  // `taskData` should include: title, description, priority, dueDate, tags (array), status (column id), boardId
  const addTask = async (boardId, columnId, taskData) => {
    try {
      // set minimal server payload: server expects boardId, title, status...
      const payload = { ...taskData, boardId, status: columnId };
      const serverTask = await createTask(payload);
      const task = normalizeTask(serverTask);
      // now dispatch into client state (adds to board.tasks and column.taskIds)
      dispatch({ type: "ADD_TASK", payload: { boardId, task } });
      return task;
    } catch (err) {
      console.error("Failed to create task:", err);
      // Could fall back to local-only add: dispatch local task with uuid — optional
    }
  };

  // UPDATE TASK: server + update client state
  const updateTask = async (boardId, taskId, updates) => {
    try {
      // NOTE: taskId here should be server _id OR normalized id; our normalize stores both fields.
      // If you passed normalized id, find server _id:
      const board = state.boards.find(b => b._id === boardId);
      const task = board && (board.tasks || []).find(t => t.id === taskId || t._id === taskId);
      const serverId = task?._id || task?.id || taskId;

      const serverUpdated = await updateTaskApi(serverId, updates);
      const normalized = normalizeTask(serverUpdated);
      // replace in client state with updated values (use `UPDATE_TASK`)
      dispatch({ type: "UPDATE_TASK", payload: { boardId, taskId: normalized.id, updates: normalized } });
      return normalized;
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // DELETE TASK
  const deleteTask = async (boardId, taskId) => {
    try {
      const board = state.boards.find(b => b._id === boardId);
      const task = board && (board.tasks || []).find(t => t.id === taskId || t._id === taskId);
      const serverId = task?._id || task?.id || taskId;
      await deleteTaskApi(serverId);
      dispatch({ type: "DELETE_TASK", payload: { boardId, taskId: taskId } });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // MOVE TASK: update task status on server and then dispatch MOVE_TASK to update columns
  const moveTask = async (boardId, taskId, newColumnId) => {
    try {
      // resolve server id
      const board = state.boards.find(b => b._id === boardId);
      const task = board && (board.tasks || []).find(t => t.id === taskId || t._id === taskId);
      const serverId = task?._id || task?.id || taskId;

      // update on server (status)
      const serverUpdated = await updateTaskApi(serverId, { status: newColumnId });
      const normalized = normalizeTask(serverUpdated);

      // dispatch a local move to rearrange columns & update task.status
      dispatch({ type: "MOVE_TASK", payload: { boardId, taskId: normalized.id, newColumnId } });
    } catch (err) {
      console.error("Failed to move task:", err);
    }
  };

  // -------------------------------------------
  // 5️⃣ Expose context values to consumers
  // -------------------------------------------
  return (
    <BoardContext.Provider
      value={{
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
