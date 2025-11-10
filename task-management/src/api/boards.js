const API_BASE = `${import.meta.env.VITE_API_URL}/api/boards`;

// Helper: check response
async function safeJson(res) {
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`HTTP ${res.status}: ${text}`);
	}
	return res.json();
}

// Helper: get auth headers
const getAuthHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		"Content-Type": "application/json",
		Authorization: token ? `Bearer ${token}` : "",
	};
};

// GET all boards for logged-in user
export const getBoards = async () => {
	const res = await fetch(API_BASE, {
		method: "GET",
		headers: getAuthHeaders(),
	});
	return safeJson(res);
};

// CREATE a new board
export const createBoardApi = async (payload) => {
	const res = await fetch(API_BASE, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(payload),
	});
	return safeJson(res);
};

// DELETE a board
export const deleteBoardApi = async (id) => {
	const res = await fetch(`${API_BASE}/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders(),
	});
	if (!res.ok) throw new Error("Failed to delete board");
	return;
};
