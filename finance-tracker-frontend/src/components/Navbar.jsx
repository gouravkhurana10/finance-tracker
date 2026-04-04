import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark"
         style={{ background: 'linear-gradient(135deg, #1F4E79, #2E75B6)' }}>
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          Finance Tracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transactions">
                💳 Transactions
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">
              Hi, {user?.name}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;