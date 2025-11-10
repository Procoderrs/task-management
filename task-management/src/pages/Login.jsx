import React, { useState,useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BoardContext } from "../context/boardContext";
import { Link } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(BoardContext); // ✅ use login from context

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/dashboard");
  }
}, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: data._id, name: data.name, email: data.email })
      );

      // ✅ Update context immediately (so ProtectedRoute sees it)
      login(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email,
      });

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800); // shorter delay
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
          Log In
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-3 rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-2 mb-3 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
  Don't have an account?{" "}
  <Link to="/" className="text-blue-500 hover:underline">
    Sign Up
  </Link>
</p>
      </div>
    </div>
  );
};

export default Login;
