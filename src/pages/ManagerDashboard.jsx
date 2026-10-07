import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  LogOut,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import api from "../api";

function ManagerDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username") || "Manager";

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/manager/leaves", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLeaves(response.data);
    } catch (err) {
      console.error(err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      setError("Unable to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAction = async (approve) => {
    if (!selectedLeave) return;

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/manager/leaves/${selectedLeave.id}/action`,
        {
          approve,
          managerComment: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedLeave(null);
      setComment("");

      await loadLeaves();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data ||
        "Unable to update leave request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const pending = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const approved = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const rejected = leaves.filter(
    (leave) => leave.status === "REJECTED"
  ).length;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  return (
    <div className="manager-app">

      <header className="manager-topbar">

        <div className="manager-brand">
          <div className="manager-logo">L</div>

          <div>
            <strong>ELMS</strong>
            <span>MANAGER PORTAL</span>
          </div>
        </div>

        <div className="manager-user">

          <div className="manager-avatar">
            {username.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <strong>{username}</strong>
            <span>Manager</span>
          </div>

          <button onClick={logout}>
            <LogOut size={17} />
          </button>

        </div>

      </header>

      <main className="manager-main">

        <div className="manager-heading">

          <div>
            <p className="section-kicker">
              MANAGEMENT OVERVIEW
            </p>

            <h1>Leave Requests</h1>

            <p>
              Review and manage employee leave applications.
            </p>
          </div>

          <button
            className="manager-refresh"
            onClick={loadLeaves}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        <div className="manager-stats">

          <div className="manager-stat">
            <div className="manager-stat-icon pending-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>
          </div>

          <div className="manager-stat">
            <div className="manager-stat-icon approved-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Approved</span>
              <strong>{approved}</strong>
            </div>
          </div>

          <div className="manager-stat">
            <div className="manager-stat-icon rejected-icon">
              <XCircle size={20} />
            </div>

            <div>
              <span>Rejected</span>
              <strong>{rejected}</strong>
            </div>
          </div>

          <div className="manager-stat">
            <div className="manager-stat-icon total-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <span>Total Requests</span>
              <strong>{leaves.length}</strong>
            </div>
          </div>

        </div>

        {error && (
          <div className="manager-error">
            {error}
          </div>
        )}

        <section className="manager-requests">

          <div className="manager-section-header">

            <div>
              <h2>Employee Requests</h2>
              <span>
                Review the latest applications
              </span>
            </div>

            <span className="request-count">
              {leaves.length} requests
            </span>

          </div>

          {loading ? (
            <div className="manager-loading">
              Loading employee requests...
            </div>
          ) : leaves.length === 0 ? (
            <div className="manager-empty">
              <CalendarDays size={30} />
              <h3>No leave requests</h3>
              <p>
                Employee applications will appear here.
              </p>
            </div>
          ) : (
            <div className="manager-request-list">

              {leaves.map((leave) => (

                <div
                  className="manager-request"
                  key={leave.id}
                >

                  <div className="manager-employee">

                    <div className="employee-avatar">
                      {leave.employeeUsername
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {leave.employeeUsername}
                      </strong>

                      <span>
                        {leave.employeeEmail}
                      </span>
                    </div>

                  </div>

                  <div className="manager-leave-info">

                    <strong>
                      {leave.leaveType}
                    </strong>

                    <span>
                      {formatDate(leave.startDate)}
                      {" — "}
                      {formatDate(leave.returnDate)}
                    </span>

                  </div>

                  <div className="manager-reason">

                    <span>REASON</span>

                    <p>
                      {leave.reason}
                    </p>

                  </div>

                  <div
                    className={`manager-status ${leave.status.toLowerCase()}`}
                  >
                    {leave.status}
                  </div>

                  <button
                    className="review-button"
                    onClick={() => {
                      setSelectedLeave(leave);
                      setComment(
                        leave.managerComment || ""
                      );
                    }}
                  >
                    Review
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

      {selectedLeave && (

        <div
          className="manager-modal-overlay"
          onClick={() => {
            if (!actionLoading) {
              setSelectedLeave(null);
              setComment("");
            }
          }}
        >

          <div
            className="manager-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-heading">

              <div>
                <p className="section-kicker">
                  LEAVE REQUEST #{selectedLeave.id}
                </p>

                <h2>
                  Review Application
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setSelectedLeave(null);
                  setComment("");
                }}
                disabled={actionLoading}
              >
                ×
              </button>

            </div>

            <div className="modal-employee">

              <div className="employee-avatar large">
                {selectedLeave.employeeUsername
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {selectedLeave.employeeUsername}
                </strong>

                <span>
                  {selectedLeave.employeeEmail}
                </span>
              </div>

            </div>

            <div className="modal-details">

              <div>
                <span>LEAVE TYPE</span>
                <strong>
                  {selectedLeave.leaveType}
                </strong>
              </div>

              <div>
                <span>START DATE</span>
                <strong>
                  {formatDate(selectedLeave.startDate)}
                </strong>
              </div>

              <div>
                <span>RETURN DATE</span>
                <strong>
                  {formatDate(selectedLeave.returnDate)}
                </strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>
                  {selectedLeave.status}
                </strong>
              </div>

            </div>

            <div className="modal-reason">

              <span>EMPLOYEE REASON</span>

              <p>
                {selectedLeave.reason}
              </p>

            </div>

            {selectedLeave.status === "PENDING" && (

              <div className="manager-comment-field">

                <label>
                  <MessageSquare size={15} />
                  Manager comment
                </label>

                <textarea
                  rows="4"
                  placeholder="Add a comment for the employee..."
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                />

              </div>

            )}

            {selectedLeave.status !== "PENDING" &&
              selectedLeave.managerComment && (

              <div className="existing-comment">

                <span>MANAGER COMMENT</span>

                <p>
                  {selectedLeave.managerComment}
                </p>

              </div>

            )}

            {selectedLeave.status === "PENDING" && (

              <div className="modal-actions">

                <button
                  className="reject-button"
                  onClick={() => handleAction(false)}
                  disabled={actionLoading}
                >
                  <XCircle size={18} />
                  {actionLoading
                    ? "Updating..."
                    : "Reject Leave"}
                </button>

                <button
                  className="approve-button"
                  onClick={() => handleAction(true)}
                  disabled={actionLoading}
                >
                  <CheckCircle2 size={18} />
                  {actionLoading
                    ? "Updating..."
                    : "Approve Leave"}
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default ManagerDashboard;