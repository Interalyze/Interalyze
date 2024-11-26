import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [activeCollapse, setActiveCollapse] = useState(null);

  const toggleCollapse = (menu) => {
    setActiveCollapse(activeCollapse === menu ? null : menu);
  };

  return (
    <div className="d-flex flex-column bg-light vh-100 p-3" style={{ width: '250px' }}>
      <h4>MetronicCloud</h4>
      <ul className="nav flex-column">
        {/* Public Profile */}
        <li className="nav-item">
          <button
            className="btn btn-link text-start w-100"
            onClick={() => toggleCollapse('profile')}
          >
            Public Profile
          </button>
          <div className={`collapse ${activeCollapse === 'profile' ? 'show' : ''}`}>
            <ul className="list-unstyled ps-3">
              <li>
                <Link className="nav-link" to="/profile/view">View Profile</Link>
              </li>
              <li>
                <Link className="nav-link" to="/profile/edit">Edit Profile</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Network */}
        <li className="nav-item">
          <button
            className="btn btn-link text-start w-100"
            onClick={() => toggleCollapse('network')}
          >
            Network
          </button>
          <div className={`collapse ${activeCollapse === 'network' ? 'show' : ''}`}>
            <ul className="list-unstyled ps-3">
              <li>
                <Link className="nav-link" to="/network/get-started">Get Started</Link>
              </li>
              <li>
                <Link className="nav-link" to="/network/user-cards">User Cards</Link>
              </li>
              <li>
                <Link className="nav-link" to="/network/user-table">User Table</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Data Lab */}
        <li className="nav-item">
          <button
            className="btn btn-link text-start w-100"
            onClick={() => toggleCollapse('dataLab')}
          >
            Data Lab
          </button>
          <div className={`collapse ${activeCollapse === 'dataLab' ? 'show' : ''}`}>
            <ul className="list-unstyled ps-3">
              <li>
                <Link className="nav-link" to="/data-lab/metrics">Metrics Hub</Link>
              </li>
              <li>
                <Link className="nav-link" to="/data-lab/analytics">Analytics</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Authentication */}
        <li className="nav-item">
          <button
            className="btn btn-link text-start w-100"
            onClick={() => toggleCollapse('auth')}
          >
            Authentication
          </button>
          <div className={`collapse ${activeCollapse === 'auth' ? 'show' : ''}`}>
            <ul className="list-unstyled ps-3">
              <li>
                <Link className="nav-link" to="/auth/login">Login</Link>
              </li>
              <li>
                <Link className="nav-link" to="/auth/register">Register</Link>
              </li>
              <li>
                <Link className="nav-link" to="/auth/reset-password">Reset Password</Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
