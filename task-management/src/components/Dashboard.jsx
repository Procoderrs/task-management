import React, { useContext } from "react";
import Header from "./Header";
import BoardCard from "./BoardCard";
import { BoardContext } from "../context/boardContext";

const Dashboard = () => {
	const { boards } = useContext(BoardContext);

	const safeBoards = Array.isArray(boards) ? boards : [];

	console.log("boards in dashboard", boards);

	return (
		<div className="min-h-screen bg-linear-to-br from-pink-100 to-yellow-50">
			<Header />

			<div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{safeBoards.length > 0 ? (
					safeBoards.map((board) =>
						board && board._id ? (
							<BoardCard key={board._id} board={board} />
						) : null
					)
				) : (
					<p className="text-gray-500">No boards yet. Add one!</p>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
