import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarDays
} from "lucide-react";
import api from "../api";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/employee/leaves", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLeaves(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      setError("Unable to load your leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const getStatusIcon = (status) => {
    if (status === "APPROVED") {
      return <CheckCircle2 size={17} />;
    }

    if (status === "REJECTED") {
      return <XCircle size={17} />;
    }

    return <Clock3 size={17} />;
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED") return "leave-status approved";
    if (status === "REJECTED") return "leave-status rejected";
    return "leave-status pending";
  };

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
    <div className="my-leaves-page">

      <div className="page-heading">
        <div>
          <p className="section-kicker">LEAVE HISTORY</p>
          <h1>My Leaves</h1>
          <p>
            Track your leave requests and approval status.
          </p>
        </div>

        <div className="calendar-icon-large">
          <ClipboardList size={25} />
        </div>
      </div>

      {loading && (
        <div className="leaves-loading">
          Loading your leave requests...
        </div>
      )}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {!loading && !error && leaves.length === 0 && (
        <div className="leaves-empty">
          <div className="empty-calendar-icon">
            <CalendarDays size={28} />
          </div>

          <h2>No leave requests yet</h2>

          <p>
            Your submitted leave requests will appear here.
          </p>
        </div>
      )}

      {!loading && leaves.length > 0 && (
        <div className="leave-list">

          {leaves.map((leave) => (

            <div className="leave-request-card" key={leave.id}>

              <div className="leave-card-top">

                <div className="leave-type-section">

                  <div className="leave-card-icon">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h2>
                      {leave.leaveType}
                    </h2>

                    <span>
                      Request #{leave.id}
                    </span>
                  </div>

                </div>

                <div className={getStatusClass(leave.status)}>
                  {getStatusIcon(leave.status)}
                  <span>{leave.status}</span>
                </div>

              </div>

              <div className="leave-details-grid">

                <div>
                  <span className="detail-label">
                    START DATE
                  </span>

                  <strong>
                    {formatDate(leave.startDate)}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">
                    RETURN DATE
                  </span>

                  <strong>
                    {formatDate(leave.returnDate)}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">
                    APPLIED ON
                  </span>

                  <strong>
                    {formatDate(
                      leave.appliedAt?.split("T")[0]
                    )}
                  </strong>
                </div>

              </div>

              <div className="leave-reason">

                <span className="detail-label">
                  REASON
                </span>

                <p>
                  {leave.reason}
                </p>

              </div>

              {leave.managerComment && (
                <div className="manager-comment">

                  <span className="detail-label">
                    MANAGER COMMENT
                  </span>

                  <p>
                    {leave.managerComment}
                  </p>

                </div>
              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyLeaves;