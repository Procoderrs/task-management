import React, { useContext } from "react";
import Header from "./Header";
import BoardCard from "./BoardCard";
import { BoardContext } from "../context/boardContext"; // ✅ import context

const Dashboard = () => {
	if (!boards) return <p>Loading boards...</p>;

	const { boards = [] } = useContext(BoardContext) || {};// ✅ use real boards
	console.log('boards in dashboard',boards);

	return (
		<div className="min-h-screen  bg-linear-to-br from-pink-100 to-yellow-50">
			<Header />

			{/* Boards grid */}
			<div className="p-6 grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-4 gap-6  ">
				{boards.length > 0 ? (
					boards.map((board) => <BoardCard key={board._id} board={board} />)
				) : (
					<p className="text-gray-500">No boards yet. Add one!</p>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
