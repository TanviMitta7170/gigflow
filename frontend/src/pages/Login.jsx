import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // FIX IS HERE: Added { withCredentials: true }
      const res = await axios.post("http://localhost:5000/api/auth/login", inputs, {
        withCredentials: true, 
      });
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl mb-6 font-bold text-center text-gray-800">Welcome Back</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="border p-3 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={e => setInputs({...inputs, email: e.target.value})} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="border p-3 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={e => setInputs({...inputs, password: e.target.value})} 
            required
          />
          {err && <p className="text-red-500 text-sm text-center">{err}</p>}
          <button className="bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition">Login</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;