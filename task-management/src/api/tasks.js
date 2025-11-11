const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;


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

// GET all tasks
export const getTasks = async () => {
	const res = await fetch(API_URL, {
		method: "GET",
		headers: getAuthHeaders(),
	});
	return safeJson(res);
};

// CREATE task
export const createTask = async (task) => {
	const res = await fetch(API_URL, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(task),
	});
	return safeJson(res);
};

// UPDATE task
export const updateTaskApi = async (id, updates) => {
	const res = await fetch(`${API_URL}/${id}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify(updates),
	});
	return safeJson(res);
};

// DELETE task
export const deleteTaskApi = async (id) => {
	const res = await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders(),
	});
	if (!res.ok) throw new Error("Failed to delete task");
	return;
};
