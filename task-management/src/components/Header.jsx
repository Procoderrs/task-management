import React, { useContext } from 'react';
import { BoardContext } from '../context/boardContext';

const Header = () => {
  const { addBoard } = useContext(BoardContext);

  const handleAddBoard = () => {
    const title = prompt('Enter board name:');
    if (title) {
      addBoard(title);
    }
  };

  return (
    <header className='bg-gradient-to-br from-pink-100 to-purple-100 shadow-2xl px-6 py-4 flex justify-between items-center'>
      <h1 className='text-2xl  text-purple-800 font-black'>Task Management</h1>
      <button
        onClick={handleAddBoard}
        className='bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-500 transition'
      >
        + Add Board
      </button>
    </header>
  );
};

export default Header;



/* 
task-management--> main-folder
node-modules
public-folder

src-folder
1: component folder
1.1 BoardCard.jsx
1.2 Dashboard.jsx
1.3 header.jsx
1.4--board-view-folder
1.4.1 board-view-jsx
1.4.2 column.jsx
1.4.3 task-card.jsx
1.4.4 task model.jsx

2:context
2.1 boardContext

3: pages
3.1 board-page.jsx
3.2dashboard-page.jsx

4 utils
4.1 getRandomColor.js
*/