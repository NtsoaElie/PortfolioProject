import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebaseConfig"; // Ensure correct import
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken(); // Get Firebase ID token
        setToken(idToken);
        localStorage.setItem("token", idToken); // Store in local storage
        navigate("/"); // Redirect to home
      }
    });
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Get Firebase token
      setToken(idToken);
      localStorage.setItem("token", idToken);
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
  <div className="login-form">
    <button onClick={handleLogin} className="login-button">
      Sign in with Google
    </button>
  </div>
</div>

  );
};

export default Login;
