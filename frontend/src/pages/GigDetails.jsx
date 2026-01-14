import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const GigDetails = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({ message: "", price: "" });
  const navigate = useNavigate();

  const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gigRes = await api.get(`/gigs/${id}`);
        setGig(gigRes.data);
        
        // Fetch bids (Backend now handles permissions for us)
        if (currentUser) {
          const bidsRes = await api.get(`/bids/${id}`);
          setBids(bidsRes.data);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [id, currentUser]);

  const handleHire = async (bidId) => {
    if(!window.confirm("Confirm hiring this freelancer?")) return;
    try {
      await api.patch(`/bids/${bidId}/hire`);
      alert("Hiring Confirmed!");
      window.location.reload();
    } catch (err) { alert("Error"); }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate("/login");
    try {
      await api.post("/bids", { gigId: id, ...bidForm });
      window.location.reload(); // Reload to see the new bid status immediately
    } catch (err) { alert(err.response?.data || "Error"); }
  };

  if (!gig) return <div className="p-10 text-center">Loading...</div>;

  const isOwner = currentUser && currentUser.id === gig.ownerId._id;
  // Find "My Bid" if I am a freelancer
  const myBid = !isOwner && bids.length > 0 ? bids[0] : null;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      
      {/* --- STATUS BANNER FOR FREELANCER --- */}
      {myBid && (
        <div className="mb-6">
          {myBid.status === "hired" && (
             <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded shadow-md">
               <h2 className="font-bold text-2xl flex items-center gap-2">🎉 Congratulations!</h2>
               <p className="text-lg">You have been <b>HIRED</b> for this project.</p>
             </div>
          )}
          {myBid.status === "rejected" && (
             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
               <p className="font-bold">Status: Rejected</p>
               <p>The client has chosen another freelancer for this position.</p>
             </div>
          )}
          {myBid.status === "pending" && (
             <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded">
               <p className="font-bold">✅ Bid Submitted</p>
               <p>Your proposal is currently under review by the client.</p>
             </div>
          )}
        </div>
      )}

      {/* Gig Info Card */}
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-100 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{gig.title}</h1>
        <div className="flex gap-4 text-sm font-semibold uppercase tracking-wide mb-6">
          <span className="text-green-600 bg-green-50 px-3 py-1 rounded">Budget: ${gig.budget}</span>
          <span className={`px-3 py-1 rounded ${gig.status === "Open" ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50"}`}>
             {gig.status}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{gig.description}</p>
      </div>

      {/* --- OWNER VIEW: MANAGE BIDS --- */}
      {isOwner && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Applicants ({bids.length})</h2>
          <div className="space-y-4">
            {bids.map(bid => (
              <div key={bid._id} className="bg-white border p-6 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{bid.freelancerId.name}</p>
                  <p className="text-gray-600 my-1">{bid.message}</p>
                  <p className="font-mono text-green-600 font-bold">${bid.price}</p>
                </div>
                <div>
                  {bid.status === 'pending' && gig.status === 'Open' && (
                    <button onClick={() => handleHire(bid._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition">
                      Hire
                    </button>
                  )}
                  {bid.status === 'hired' && <span className="text-green-600 font-bold border border-green-600 px-4 py-1 rounded">HIRED</span>}
                  {bid.status === 'rejected' && <span className="text-gray-400 font-medium">Rejected</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- FREELANCER VIEW: BID FORM --- */}
      {/* Only show form if user is logged in, NOT owner, NOT already bid, and gig is OPEN */}
      {!isOwner && !myBid && gig.status === 'Open' && currentUser && (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-inner">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Submit a Proposal</h3>
          <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
            <input type="number" placeholder="Your Bid Amount ($)" className="p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none"
              onChange={e => setBidForm({...bidForm, price: e.target.value})} required />
            <textarea placeholder="Why are you the best fit?" className="p-3 border rounded h-32 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={e => setBidForm({...bidForm, message: e.target.value})} required />
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold shadow transition">
              Send Proposal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GigDetails;