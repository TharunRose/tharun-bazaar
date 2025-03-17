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
        navigate("/task");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/task");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="container min-w-screen">
      <h1 className="login-h1">Task Management</h1>
      <h2 className="login-h2">Login</h2>
      <div className="google">
        <button className="google-btn" onClick={handleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Login;
