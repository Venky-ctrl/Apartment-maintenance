import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Apartment Maintenance</div>
      <div className="navbar-links">
        <Link className="navbar-link" to="/">
          Home
        </Link>
        {user && (
          <Link className="navbar-link" to="/requests">
            Requests
          </Link>
        )}
        {!user ? (
          <>
            <Link className="navbar-link" to="/login">
              Login
            </Link>
            <Link className="navbar-link" to="/register">
              Register
            </Link>
          </>
        ) : (
          <button className="navbar-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
