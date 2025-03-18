import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase auth
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For redirecting after logout

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/"); // Redirect to Login after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Hide Navbar on Login page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          Tharun Bazaar
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="nav-toggle" onClick={toggleMenu}>
          ☰
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          {!user && (
            <li>
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
          <li>
            <Link to="/home" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/myorders" className="nav-link" onClick={() => setIsOpen(false)}>
              My Orders
            </Link>
          </li>
          {user && (
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
