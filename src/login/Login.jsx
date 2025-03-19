import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/home");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const adminLogin = async () => {
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Tharun Bazaar</h1>
        <p className="login-tagline">
          Your one-stop shop for the best deals and seamless shopping
          experience.
        </p>
        <h2 className="login-subtitle">Login</h2>
        <div className="google">
          <button className="google-btn" onClick={handleLogin}>
            Sign in with Google
          </button>
        </div>
        <br />
        <div className="google">
          <button className="google-btn" onClick={adminLogin}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
