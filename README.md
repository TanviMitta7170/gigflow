# GigFlow - Mini Freelance Marketplace

GigFlow is a full-stack freelance marketplace platform where Clients can post jobs (Gigs) and Freelancers can bid on them. It features secure authentication, role-based bidding logic, and real-time status updates for hiring.

## 🚀 Features

* **User Authentication:** Secure Login/Register using JWT & HttpOnly Cookies.
* **Role-Fluid System:** Single user account can act as both Client and Freelancer.
* **Gig Management:** Post jobs with Title, Description, and Budget.
* **Bidding System:** Freelancers can place bids; Owners can view all received bids.
* **Hiring Logic (Atomic):**
    * Hiring a freelancer automatically marks the Gig as "Assigned".
    * Updates the winning bid to "Hired".
    * Automatically rejects all other bids for that gig.
* **Status Transparency:** Freelancers can see their specific bid status (Pending/Hired/Rejected).

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repo-link>
    cd GigFlow
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file based on .env.example
    # Add your MONGO_URI and JWT_SECRET
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🧪 Testing the "Hiring" Flow

1.  **Client:** Register a user (e.g., "Client"). Post a new Gig.
2.  **Freelancer:** Open Incognito mode. Register a new user (e.g., "Dev"). Bid on the Gig.
3.  **Hiring:** Back in the Client window, view the Gig and click **"Hire"**.
4.  **Verification:** The Gig status changes to "Assigned" (Closed), and the Freelancer sees a "Congratulations" banner.