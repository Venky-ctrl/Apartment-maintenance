import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import RequestForm from "./RequestForm";
import RequestsItem from "./RequestsItem";

const RequestsList = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setError("");
    try {
      const res = await api.get("/requests");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/requests/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="requests-layout">
      <div>
        <div className="card">
          <h2>Create request</h2>
          <p className="card-subtitle">
            Describe the issue so your landlord can resolve it quickly.
          </p>
          <RequestForm onCreated={fetchRequests} />
        </div>
      </div>

      <div>
        {error && <p className="error-text">{error}</p>}
        {requests.length === 0 ? (
          <div className="card">
            <p>No requests found.</p>
          </div>
        ) : (
          requests.map((req) => (
            <RequestsItem
              key={req.id}
              request={req}
              canUpdateStatus={user?.role === "landlord"}
              onStatusChange={
                user?.role === "landlord" ? handleStatusChange : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsList;
