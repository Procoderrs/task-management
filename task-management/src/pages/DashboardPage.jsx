import { useContext } from 'react';
import { BoardContext } from '../context/boardContext';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const { boards, addBoard, deleteBoard } = useContext(BoardContext);

  return (
    <div>
     <Dashboard/>
    </div>
  );
};
export default DashboardPage;