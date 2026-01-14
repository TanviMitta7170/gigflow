import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GigDetails from "./pages/GigDetails";
import CreateGig from "./pages/CreateGig";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gig/:id" element={<GigDetails />} />
          <Route path="/add" element={<CreateGig />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;