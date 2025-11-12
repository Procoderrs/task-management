// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = (children) => {
	const token = localStorage.getItem("token");

	// If token not found, redirect to login
	if (!token) return <Navigate to="/login" replace />;

	return  <Outlet />;
};

export default ProtectedRoute;
