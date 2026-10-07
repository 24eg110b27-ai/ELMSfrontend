import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  CheckCircle2
} from "lucide-react";
import api from "../api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/employee/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-loading">
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        Unable to load profile.
      </div>
    );
  }

  const initials = profile.username
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="profile-page">

      <div className="page-heading profile-heading">
        <div>
          <p className="section-kicker">ACCOUNT</p>
          <h1>My Profile</h1>
          <p>
            Manage and view your ELMS account information.
          </p>
        </div>

        <div className="profile-heading-icon">
          <UserRound size={24} />
        </div>
      </div>

      <div className="profile-layout">

        <section className="profile-card">

          <div className="profile-cover">
            <div className="profile-cover-label">
              ELMS EMPLOYEE
            </div>
          </div>

          <div className="profile-main">

            <div className="profile-avatar-large">
              {initials}
            </div>

            <div className="profile-name">
              <h2>{profile.username}</h2>
              <span>Employee Account</span>
            </div>

          </div>

          <div className="profile-divider"></div>

          <div className="profile-info">

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <UserRound size={18} />
              </div>

              <div className="profile-info-text">
                <span>USERNAME</span>
                <strong>{profile.username}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <Mail size={18} />
              </div>

              <div className="profile-info-text">
                <span>EMAIL ADDRESS</span>
                <strong>{profile.email}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <ShieldCheck size={18} />
              </div>

              <div className="profile-info-text">
                <span>ACCOUNT ROLE</span>
                <strong>{profile.role}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <CalendarDays size={18} />
              </div>

              <div className="profile-info-text">
                <span>ACCOUNT ID</span>
                <strong>#{profile.id}</strong>
              </div>
            </div>

          </div>

        </section>

        <section className="profile-side-card">

          <div className="profile-side-header">
            <div className="profile-side-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2>Account Security</h2>
              <p>
                Your account is protected by ELMS security.
              </p>
            </div>
          </div>

          <div className="security-list">

            <div className="security-status">
              <CheckCircle2 size={18} />
              <div>
                <strong>Authentication Active</strong>
                <span>Your account is securely authenticated.</span>
              </div>
            </div>

            <div className="security-status">
              <CheckCircle2 size={18} />
              <div>
                <strong>Employee Access</strong>
                <span>Employee portal access is enabled.</span>
              </div>
            </div>

            <div className="security-status">
              <CheckCircle2 size={18} />
              <div>
                <strong>Protected Session</strong>
                <span>Your session uses secure authentication.</span>
              </div>
            </div>

          </div>

          <div className="security-footer">
            <span className="security-dot"></span>
            ELMS account active
          </div>

        </section>

      </div>

    </div>
  );
}

export default Profile;