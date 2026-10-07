import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  UserRound,
  LogOut,
  X
} from "lucide-react";

function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Calendar",
      icon: CalendarDays
    },
    {
      name: "My Leaves",
      icon: ClipboardList
    },
    {
      name: "Profile",
      icon: UserRound
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    window.location.href = "/";
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-brand">
          <div className="sidebar-logo">L</div>

          <div>
            <div className="sidebar-title">ELMS</div>
            <div className="sidebar-subtitle">LEAVE MANAGEMENT</div>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`sidebar-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setMobileOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-help">
            <div className="help-icon">?</div>

            <div>
              <strong>Need help?</strong>
              <span>Contact your manager</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;