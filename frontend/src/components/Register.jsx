import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      await register(name, email, password, role);
      setSuccessMsg("User created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const backendMsg = err.response?.data;
      setError(
        typeof backendMsg === "string" ? backendMsg : "Registration failed."
      );
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Create account</h2>
        <p className="card-subtitle">
          Register as a tenant or landlord to manage maintenance requests.
        </p>

        {error && <p className="error-text">{error}</p>}
        {successMsg && <p className="success-text">{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <button type="submit" className="primary-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
