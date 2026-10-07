import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Send,
  X
} from "lucide-react";
import api from "../api";

function CalendarPage({ onLeaveApplied }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    returnDate: "",
    leaveType: "CASUAL",
    reason: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const selected = new Date(year, month, day);

    setSelectedDate(selected);

    const formatted = formatDate(selected);

    setFormData({
      startDate: formatted,
      returnDate: formatted,
      leaveType: "CASUAL",
      reason: ""
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/employee/leaves",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Leave request submitted successfully.");

      setFormData({
        startDate: "",
        returnDate: "",
        leaveType: "CASUAL",
        reason: ""
      });

      if (onLeaveApplied) {
        onLeaveApplied();
      }

      setTimeout(() => {
        setShowForm(false);
        setMessage("");
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to submit leave request."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isToday = (day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="calendar-page">

      <div className="page-heading">
        <div>
          <p className="section-kicker">LEAVE CALENDAR</p>
          <h1>Plan your time off</h1>
          <p>
            Select a date to submit a new leave request.
          </p>
        </div>

        <div className="calendar-icon-large">
          <CalendarDays size={25} />
        </div>
      </div>

      <div className="calendar-layout">

        <section className="calendar-card">

          <div className="calendar-header">

            <button
              className="calendar-nav"
              onClick={previousMonth}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="calendar-month">
              <h2>
                {monthName} {year}
              </h2>
              <span>Select a date</span>
            </div>

            <button
              className="calendar-nav"
              onClick={nextMonth}
            >
              <ChevronRight size={20} />
            </button>

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
            ].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="calendar-grid">

            {calendarDays.map((day, index) => {

              const selected =
                selectedDate &&
                day &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <button
                  key={index}
                  className={`
                    calendar-day
                    ${!day ? "empty" : ""}
                    ${isToday(day) ? "today" : ""}
                    ${selected ? "selected" : ""}
                  `}
                  onClick={() => handleDateClick(day)}
                  disabled={!day}
                >
                  {day}
                </button>
              );
            })}

          </div>

          <div className="calendar-footer">
            <span>
              <i className="legend-dot today-dot"></i>
              Today
            </span>

            <span>
              <i className="legend-dot selected-dot"></i>
              Selected
            </span>
          </div>

        </section>

        {showForm && (
          <section className="leave-form-card">

            <div className="form-card-header">

              <div>
                <p className="section-kicker">
                  NEW REQUEST
                </p>

                <h2>Apply for leave</h2>
              </div>

              <button
                className="close-form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <div className="form-field">
                  <label>Start date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Return date</label>

                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    min={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-field">

                <label>Leave type</label>

                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="PERSONAL">Personal Leave</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                  <option value="OTHER">Other</option>
                </select>

              </div>

              <div className="form-field">

                <label>Reason</label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell your manager why you need leave..."
                  rows="5"
                  required
                />

              </div>

              {message && (
                <div className="form-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="submit-leave-button"
                disabled={loading}
              >
                <Send size={18} />

                <span>
                  {loading
                    ? "Submitting..."
                    : "Submit Leave Request"}
                </span>
              </button>

            </form>

          </section>
        )}

        {!showForm && (
          <section className="calendar-empty-card">

            <div className="empty-calendar-icon">
              <CalendarDays size={28} />
            </div>

            <h2>Select a date</h2>

            <p>
              Choose a date from the calendar to start
              your leave application.
            </p>

          </section>
        )}

      </div>

    </div>
  );
}

export default CalendarPage;