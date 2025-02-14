import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.tsx";
import AboutMe from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Projects from "./pages/Projects.tsx";
import Login from "./pages/Login.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx"; // Assuming you have an AdminDashboard component
import { auth } from './pages/firebaseConfig.js';
import './pages/i18n.js'; 

function App() {
  const [user, setUser] = useState(null); // Store user data
  const [isAdmin, setIsAdmin] = useState(false); // Flag to determine if user is an admin
  const [adminData, setAdminData] = useState(""); // Store fetched admin data

  // useEffect to handle auth state changes
  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Check if the user has an admin claim
        currentUser.getIdTokenResult().then((idTokenResult) => {
          console.log('Admin status before: ', idTokenResult.claims.admin); // Log before
          setIsAdmin(idTokenResult.claims.admin); // Assuming `admin` is a custom claim in Firebase Auth
        });
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/admin/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching admin data:", await response.text());
        return;
      }

      const data = await response.text();
      setAdminData(data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const setAdmin = async (uid) => {
    const token = localStorage.getItem('token');  // Get the stored token from localStorage
    if (!token) {
      alert('You need to log in first!');
      return;
    }
  
    try {
      console.log('Admin status before: ', isAdmin); // Log before the admin change
  
      const response = await fetch('http://localhost:8080/admin/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
        },
        body: JSON.stringify({ uid }),
      });
  
      if (response.ok) {
        alert('Admin claim added successfully');
        console.log('Admin claim added successfully');
        await refreshToken();  // Refresh the token to reflect the new admin status
      } else {
        const errorText = await response.text();
        console.error('Failed to add admin claim:', errorText);
      }
    } catch (error) {
      console.error('Error setting admin claim:', error);
    }
  };
  
  // Function to refresh token and update user admin status in localStorage
  const refreshToken = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true); // Force refresh token
        console.log('Refreshed Token:', token);
        localStorage.setItem("token", token);  // Store the refreshed token
        
        // Log the admin status after refresh
        const idTokenResult = await user.getIdTokenResult();
        console.log('Admin status after refresh: ', idTokenResult.claims.admin); // Log after refresh
        setIsAdmin(idTokenResult.claims.admin);  // Update the admin status based on the new token
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };
  

  return (
    <Router>
      <div>
        {/* Admin actions for fetching data and setting admin
        {isAdmin && (
          <div>
            <button onClick={fetchAdminData}>Get Admin Data</button>
            <button onClick={() => setAdmin('zofrmaCWG7aDd9bxliZfQLhsFYN2')}>Make User Admin</button>
            <p>{adminData}</p>
          </div>
        )} */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Route: Show only if the user is logged in and is an admin */}
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
