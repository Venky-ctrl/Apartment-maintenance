import React from "react";

const RequestItem = ({ request, canUpdateStatus, onStatusChange }) => {
  const handleChange = (e) => {
    onStatusChange && onStatusChange(request.id, e.target.value);
  };

  const priorityClass =
    request.priority === "high"
      ? "priority-high"
      : request.priority === "normal"
      ? "priority-normal"
      : "priority-low";

  return (
    <div className="request-card">
      <div className="request-card-header">
        <div className="request-title">{request.title}</div>
        <span className={`request-pill ${priorityClass}`}>
          {request.priority}
        </span>
      </div>
      <p style={{ fontSize: "0.86rem", color: "#d1d5db" }}>
        {request.description}
      </p>
      <div className="request-meta">
        <span>#{request.id}</span>
        <span className="request-pill status-pill">{request.status}</span>
      </div>
      {canUpdateStatus && (
        <select
          className="status-select"
          value={request.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </div>
  );
};

export default RequestItem;
