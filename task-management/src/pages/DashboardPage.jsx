import { useContext } from 'react';
import { BoardContext } from '../context/boardContext';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const { boards, addBoard, deleteBoard } = useContext(BoardContext);

  return (
    <div>
     <Dashboard/>
      {/* {boards.map(b => (
        <div key={b.id}>
          <h2>{b.title}</h2>
          <button onClick={() => deleteBoard(b.id)}>Delete</button>
        </div>
      ))}
      <button onClick={() => addBoard('New Board')}>Add Board</button> */}
    </div>
  );
};
export default DashboardPage;