import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";  
import "./HomeAdmin.css";

function HomeAdmin() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <div className="admin-grid">

        <Link to="/admin/queries" className="admin-card">
          <h3>Queries</h3>
          <p>Manage all user queries</p>
        </Link>

        <Link to="/admin/consultations" className="admin-card">
          <h3>Consultations</h3>
          <p>Manage consultation bookings</p>
        </Link>

        <Link to="/admin/users" className="admin-card">
          <h3>Users</h3>
          <p>Manage registered users</p>
        </Link>

        <Link to="/admin/email-leads" className="admin-card">
          <h3>Email Leads</h3>
          <p>Free-guide subscribers — track follow-up status</p>
        </Link>

      </div>
    </div>
  );
}

export default HomeAdmin;