import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { BoardContext } from "../context/boardContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(BoardContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-purple-700 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
