import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="page-center">
      <div className="card" style={{ maxWidth: 520 }}>
        <h2>Welcome to the Maintenance Portal</h2>
        <p className="card-subtitle">
          Track apartment issues, create new requests, and let your landlord
          manage them in one place.
        </p>

        {user ? (
          <>
            <p style={{ marginTop: 10 }}>
              Logged in as <strong>{user.name}</strong> ({user.role}).
            </p>
            <Link to="/requests">
              <button className="primary-button" style={{ marginTop: 18 }}>
                Go to requests
              </button>
            </Link>
          </>
        ) : (
          <>
            <p style={{ marginTop: 10 }}>
              Get started by creating an account or logging in to your existing
              one.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Link to="/login" style={{ flex: 1 }}>
                <button className="primary-button">Login</button>
              </Link>
              <Link to="/register" style={{ flex: 1 }}>
                <button className="primary-button">Register</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
