import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { BoardContext } from "../context/boardContext";

function BoardCard({ board }) {
	const navigate = useNavigate();
	console.log("board-id-board-card", board._id);
	console.log("🔍 Board received in BoardView:", board);
	console.log("🧩 board.title type:", typeof board.title, board.title);


	const { deleteBoard } = useContext(BoardContext);

	const handleClick = () => {
		navigate(`/board/${board._id}`);
	};

	const handleDelete = (e) => {
		e.stopPropagation(); // prevent navigating
		if (window.confirm("Are you sure you want to delete this board?")) {
			deleteBoard(board._id);
		}
	};

	return (
		<div
			onClick={handleClick}
			className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg transition relative"
			style={{ backgroundColor: board.color }}
		>
			<h2 className="text-lg font-bold text-zinc-700 ">
  {typeof board.title === "string" ? board.title : JSON.stringify(board.title)}
</h2>

			<button
				onClick={handleDelete}
				className="absolute top-2 cursor-pointer right-3 p-2 text-red-500 hover:bg-red-200 hover:text-red-700"
			>
				✕
			</button>
		</div>
	);
}

export default BoardCard;
