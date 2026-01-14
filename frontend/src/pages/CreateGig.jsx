import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateGig = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    budget: ""
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // connecting to backend [cite: 30]
      // withCredentials: true is REQUIRED to send the HttpOnly cookie [cite: 12]
      await axios.post("http://localhost:5000/api/gigs", inputs, {
        withCredentials: true,
      });
      navigate("/"); // Redirect to home page after success
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Post a New Gig</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Job Title */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Build a React Website"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Project Description</label>
            <textarea
              name="description"
              placeholder="Describe the requirements in detail..."
              rows="6"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Budget ($)</label>
            <input
              type="number"
              name="budget"
              placeholder="e.g. 500"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-1/3"
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {err && <p className="text-red-500 text-sm font-semibold">{err}</p>}

          {/* Submit Button */}
          <button className="bg-green-600 text-white p-4 rounded font-bold text-lg hover:bg-green-700 transition shadow-md mt-2">
            Publish Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;