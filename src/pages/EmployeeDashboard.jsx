import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ArrowUpRight,
  UserRound,
} from "lucide-react";

import api from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CalendarPage from "./CalendarPage";
import MyLeaves from "./MyLeaves";
import Profile from "./Profile";

function EmployeeDashboard() {

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [leaves, setLeaves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [currentDate, setCurrentDate] =
    useState(new Date());

  useEffect(() => {

    loadLeaves();

  }, []);

  const loadLeaves = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response =
        await api.get("/employee/leaves", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      setLeaves(response.data);

    } catch (err) {

      console.error(err);

      if (err.response?.status === 401 ||
          err.response?.status === 403) {

        localStorage.clear();
        window.location.href = "/";

        return;
      }

      setError("Unable to load your leave information.");

    } finally {

      setLoading(false);

    }
  };

  const pendingCount =
    leaves.filter(
      leave => leave.status === "PENDING"
    ).length;

  const approvedCount =
    leaves.filter(
      leave => leave.status === "APPROVED"
    ).length;

  const rejectedCount =
    leaves.filter(
      leave => leave.status === "REJECTED"
    ).length;

  const monthName =
    currentDate.toLocaleString(
      "default",
      { month: "long" }
    );

  const year =
    currentDate.getFullYear();

  const firstDay =
    new Date(
      year,
      currentDate.getMonth(),
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      currentDate.getMonth() + 1,
      0
    ).getDate();

  const previousMonth = () => {

    setCurrentDate(
      new Date(
        year,
        currentDate.getMonth() - 1,
        1
      )
    );

  };

  const nextMonth = () => {

    setCurrentDate(
      new Date(
        year,
        currentDate.getMonth() + 1,
        1
      )
    );

  };

  const getStatusClass = (status) => {

    if (status === "APPROVED")
      return "status-approved";

    if (status === "REJECTED")
      return "status-rejected";

    return "status-pending";

  };

  const formatDate = (date) => {

    return new Date(date + "T00:00:00")
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

  };

  return (
    <div className="dashboard-layout">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="dashboard-main">

        <Topbar
          setMobileOpen={setMobileOpen}
        />

        <main className="dashboard-content">

          {activePage === "Dashboard" && (
            <>

              <div className="dashboard-heading">

                <div>

                  <p className="dashboard-eyebrow">
                    OVERVIEW
                  </p>

                  <h1>
                    Welcome back,{" "}
                    {localStorage.getItem(
                      "username"
                    ) || "Employee"}
                  </h1>

                  <p>
                    Here's what's happening with
                    your leave requests.
                  </p>

                </div>

                <button
                  className="primary-action"
                  onClick={() =>
                    setActivePage("Calendar")
                  }
                >
                  <Plus size={18} />
                  Apply for Leave
                </button>

              </div>

              {error && (
                <div className="dashboard-error">
                  {error}
                </div>
              )}

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon pending">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <span>Pending</span>
                    <strong>{pendingCount}</strong>
                  </div>

                  <ArrowUpRight size={17} />

                </div>

                <div className="stat-card">

                  <div className="stat-icon approved">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <span>Approved</span>
                    <strong>{approvedCount}</strong>
                  </div>

                  <ArrowUpRight size={17} />

                </div>

                <div className="stat-card">

                  <div className="stat-icon rejected">
                    <XCircle size={20} />
                  </div>

                  <div>
                    <span>Rejected</span>
                    <strong>{rejectedCount}</strong>
                  </div>

                  <ArrowUpRight size={17} />

                </div>

                <div className="stat-card">

                  <div className="stat-icon total">
                    <ClipboardList size={20} />
                  </div>

                  <div>
                    <span>Total Requests</span>
                    <strong>{leaves.length}</strong>
                  </div>

                  <ArrowUpRight size={17} />

                </div>

              </div>

              <div className="dashboard-grid">

                <section className="calendar-card">

                  <div className="section-header">

                    <div>
                      <p>LEAVE CALENDAR</p>
                      <h2>{monthName} {year}</h2>
                    </div>

                    <div className="calendar-controls">

                      <button
                        onClick={previousMonth}
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={nextMonth}
                      >
                        <ChevronRight size={18} />
                      </button>

                    </div>

                  </div>

                  <div className="calendar-weekdays">

                    {[
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat"
                    ].map(day => (
                      <span key={day}>
                        {day}
                      </span>
                    ))}

                  </div>

                  <div className="calendar-days">

                    {Array.from({
                      length: firstDay
                    }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="calendar-day empty"
                      />
                    ))}

                    {Array.from({
                      length: daysInMonth
                    }).map((_, index) => {

                      const day =
                        index + 1;

                      const dateString =
                        `${year}-${String(
                          currentDate.getMonth() + 1
                        ).padStart(2, "0")}-${String(
                          day
                        ).padStart(2, "0")}`;

                      const leave =
                        leaves.find(
                          item =>
                            dateString >=
                              item.startDate &&
                            dateString <=
                              item.returnDate
                        );

                      const today =
                        new Date();

                      const isToday =
                        day ===
                          today.getDate() &&
                        currentDate.getMonth() ===
                          today.getMonth() &&
                        year ===
                          today.getFullYear();

                      return (
                        <div
                          key={day}
                          className={`calendar-day ${
                            isToday
                              ? "today"
                              : ""
                          } ${
                            leave
                              ? "has-leave"
                              : ""
                          }`}
                        >

                          <span>
                            {day}
                          </span>

                          {leave && (
                            <small
                              className={
                                getStatusClass(
                                  leave.status
                                )
                              }
                            >
                              {leave.status
                                .toLowerCase()}
                            </small>
                          )}

                        </div>
                      );

                    })}

                  </div>

                </section>

                <section className="recent-card">

                  <div className="section-header">

                    <div>
                      <p>RECENT ACTIVITY</p>
                      <h2>My Leaves</h2>
                    </div>

                    <button
                      className="view-all"
                      onClick={() =>
                        setActivePage("My Leaves")
                      }
                    >
                      View all
                    </button>

                  </div>

                  {loading ? (
                    <div className="empty-state">
                      Loading leaves...
                    </div>
                  ) : leaves.length === 0 ? (
                    <div className="empty-state">
                      <CalendarDays size={30} />
                      <span>
                        No leave requests yet.
                      </span>
                    </div>
                  ) : (

                    <div className="leave-list">

                      {leaves
                        .slice(0, 4)
                        .map(leave => (

                          <div
                            className="leave-row"
                            key={leave.id}
                          >

                            <div className="leave-date">
                              <strong>
                                {new Date(
                                  leave.startDate
                                ).getDate()}
                              </strong>

                              <span>
                                {new Date(
                                  leave.startDate
                                ).toLocaleString(
                                  "default",
                                  { month: "short" }
                                )}
                              </span>
                            </div>

                            <div className="leave-info">

                              <strong>
                                {leave.leaveType}
                              </strong>

                              <span>
                                {formatDate(
                                  leave.startDate
                                )}
                                {" — "}
                                {formatDate(
                                  leave.returnDate
                                )}
                              </span>

                            </div>

                            <span
                              className={`leave-status ${getStatusClass(
                                leave.status
                              )}`}
                            >
                              {leave.status}
                            </span>

                          </div>

                        ))}

                    </div>

                  )}

                </section>

              </div>

              <section className="leave-summary-card">

                <div className="summary-icon">
                  <CalendarDays size={23} />
                </div>

                <div>

                  <span>
                    NEED TIME OFF?
                  </span>

                  <h3>
                    Plan your next leave
                  </h3>

                  <p>
                    Select a date from the calendar
                    and submit your leave request.
                  </p>

                </div>

                <button
                  className="summary-button"
                  onClick={() =>
                    setActivePage("Calendar")
                  }
                >
                  Apply Leave
                  <ArrowUpRight size={17} />
                </button>

              </section>

            </>
          )}
{activePage === "Calendar" && (
  <CalendarPage onLeaveApplied={loadLeaves} />
)}

         {activePage === "My Leaves" && (
  <MyLeaves />
)}

         {activePage === "Profile" && (
  <Profile />
)}

        </main>

      </div>

    </div>
  );
}

export default EmployeeDashboard;