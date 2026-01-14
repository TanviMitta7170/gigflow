import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setErr(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl mb-6 font-bold text-center text-gray-800">Create Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" className="border p-3 rounded bg-gray-50" 
            onChange={e => setInputs({...inputs, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="border p-3 rounded bg-gray-50" 
            onChange={e => setInputs({...inputs, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="border p-3 rounded bg-gray-50" 
            onChange={e => setInputs({...inputs, password: e.target.value})} required />
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button className="bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;