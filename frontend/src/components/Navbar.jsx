import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      updateUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <Link to="/" className="text-2xl font-bold text-green-400">GigFlow</Link>
      <div className="flex gap-6 items-center">
        {currentUser ? (
          <>
            <span className="text-gray-300">Welcome, {currentUser.name}</span>
            <Link to="/add" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Post Gig</Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button>
          </>
        ) : (
          <div className="flex gap-4">
             <Link to="/login" className="hover:text-green-400">Login</Link>
             <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;