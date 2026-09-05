import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import "./FacultyProfile.css";

function FacultyProfile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Dr. Rahul Sharma",
    facultyId: "FAC-2024-001",
    email: user?.email || "rahul.sharma@ssism.ac.in",
    department: user?.department || "Information Technology & Engg. (ITEG)",
    designation: "Professor & Head of Department",
    phone: "+91 98765 43210",
    joiningDate: "15 July 2020",
    office: "ITEG Academic Block, Room 204",
  });

  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setToast("Profile updated successfully!");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="faculty-profile-page">
      {toast && <div className="profile-toast">{toast}</div>}

      <div className="profile-page-header">
        <div>
          <h1>Faculty Profile</h1>
          <p>View and manage your academic credentials and contact information</p>
        </div>
        {!isEditing && (
          <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-card-grid">
        {/* Left Column: Avatar & Basic Info */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar">
            <span>{profile.name.charAt(0)}</span>
          </div>
          <h2>{profile.name}</h2>
          <p className="profile-desig">{profile.designation}</p>
          <span className="profile-dept-badge">{profile.department}</span>

          <div className="profile-meta-list">
            <div className="meta-item">
              <span className="meta-label">Faculty ID</span>
              <strong className="meta-value">{profile.facultyId}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Joining Date</span>
              <strong className="meta-value">{profile.joiningDate}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Office Room</span>
              <strong className="meta-value">{profile.office}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Form/Fields */}
        <div className="profile-details-card">
          <h3>Personal & Academic Details</h3>

          {isEditing ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={profile.designation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Office Location</label>
                  <input
                    type="text"
                    name="office"
                    value={profile.office}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details-grid">
              <div className="detail-box">
                <span className="detail-label">Full Name</span>
                <strong className="detail-val">{profile.name}</strong>
              </div>
              <div className="detail-box">
                <span className="detail-label">Email Address</span>
                <strong className="detail-val">{profile.email}</strong>
              </div>
              <div className="detail-box">
                <span className="detail-label">Phone Number</span>
                <strong className="detail-val">{profile.phone}</strong>
              </div>
              <div className="detail-box">
                <span className="detail-label">Designation</span>
                <strong className="detail-val">{profile.designation}</strong>
              </div>
              <div className="detail-box">
                <span className="detail-label">Department</span>
                <strong className="detail-val">{profile.department}</strong>
              </div>
              <div className="detail-box">
                <span className="detail-label">Office Location</span>
                <strong className="detail-val">{profile.office}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyProfile;
