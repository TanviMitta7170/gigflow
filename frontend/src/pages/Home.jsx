import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs?search=${search}`);
        setGigs(res.data);
      } catch (err) { console.error(err); }
    };
    fetchGigs();
  }, [search]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Job Feed</h1>
        <input 
          type="text" 
          placeholder="Search jobs..." 
          className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      {gigs.length === 0 ? (
         <p className="text-gray-500">No gigs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <div key={gig._id} className={`p-6 rounded-lg shadow-md transition flex flex-col justify-between border ${gig.status === 'Assigned' ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
              
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{gig.title}</h2>
                  [cite_start]{/* STATUS BADGE [cite: 25] */}
                  {gig.status === 'Assigned' ? (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">CLOSED</span>
                  ) : (
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">OPEN</span>
                  )}
                </div>
                <div className="mb-2">
                   <span className="font-semibold text-gray-700">${gig.budget}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{gig.description}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                 <span className="text-xs text-gray-500">Posted by: {gig.ownerId?.name || "User"}</span>
                 <Link to={`/gig/${gig._id}`} className="text-blue-600 font-semibold text-sm hover:underline">
                   {gig.status === 'Assigned' ? "View Status →" : "View Details →"}
                 </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Home;