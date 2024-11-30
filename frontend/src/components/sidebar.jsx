import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [activeCollapse, setActiveCollapse] = useState(null);

  const toggleCollapse = (menu) => {
    setActiveCollapse(activeCollapse === menu ? null : menu);
  };

  return (
    <div className="sidebar">
      <h4>Interalyze</h4>
      <ul className="nav flex-column">
        {/* Public Profile */}
        <li className="nav-item">
          <button
            className="btn-link"
            onClick={() => toggleCollapse('profile')}
          >
            Public Profile
          </button>
          <div className={`collapse ${activeCollapse === 'profile' ? 'show' : ''}`}>
            <ul className="list-unstyled ps-3">
              <li>
                <Link className="nav-link" to="/Mainpage">Main Page</Link>
              </li>
              <li>
                <Link className="nav-link" to="/Mainpage/ChangeUserDetails">Edit Profile</Link>
              </li>
              <li>
                <Link className="nav-link" to="/Mainpage/Videoview">View a Video</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Network */}
        <li className="nav-item">
          <button
            className="btn-link"
            onClick={() => toggleCollapse('network')}
          >
            Candidates
          </button>
          <div className={`collapse ${activeCollapse === 'network' ? 'show' : ''}`}>
            <ul className="list-unstyled ps-3">
              <li>
                <Link className="nav-link" to="/Candidate">Candidate Dashboard</Link>
              </li>
              <li>
                <Link className="nav-link" to="/Candidate/CreateCandidate">Create Candidates</Link>
              </li>
              <li>
                <Link className="nav-link" to="/Candidate">User Table</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Data Lab */}
        <li className="nav-item">
          <button
            className="btn-link"
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
