// src/api/boards.js
const API_BASE = "http://localhost:5000/api/boards";

async function safeJson(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const getBoards = async () => {
  const res = await fetch(API_BASE);
  return safeJson(res);
};

export const createBoardApi = async (payload) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return safeJson(res);
};

export const deleteBoardApi = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete board");
  return;
};
