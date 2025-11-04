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
    <header className='bg-white shadow-2xl px-6 py-4 flex justify-between items-center'>
      <h1 className='text-2xl font-semibold text-gray-800'>Task Management</h1>
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
