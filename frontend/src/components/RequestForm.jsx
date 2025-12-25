import React, { useState } from "react";
import api from "../api/api";

const RequestForm = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/requests", { title, description, priority });
      onCreated && onCreated();
      setTitle("");
      setDescription("");
      setPriority("low");
    } catch (err) {
      const backendErr = err.response?.data?.error;
      setError(backendErr || "Failed to create request. Try again.");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Create Maintenance Request</h3>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <br />
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <br />
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <br />
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="primary-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
