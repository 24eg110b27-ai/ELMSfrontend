import {
  Menu,
  Bell,
  ChevronDown
} from "lucide-react";

function Topbar({ setMobileOpen }) {

  const username = localStorage.getItem("username") || "Employee";

  const initials = username
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="topbar">

      <button
        className="mobile-menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>

      <div className="topbar-left">
        <span className="topbar-label">
          EMPLOYEE PORTAL
        </span>
      </div>

      <div className="topbar-right">

        <button className="notification-button">
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>

        <div className="profile-mini">

          <div className="avatar">
            {initials}
          </div>

          <div className="profile-mini-info">
            <strong>{username}</strong>
            <span>Employee</span>
          </div>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}

export default Topbar;