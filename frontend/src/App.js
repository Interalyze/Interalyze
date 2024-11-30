// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import MainPage from './pages/mainPage'; // Main dashboard
import AuthPage from './pages/authPage';
//import ProfileView from './pages/ProfileView'; // Example subpage
//import ProfileEdit from './pages/ProfileEdit'; // Example subpage
//import Network from './pages/network';
//import DataLab from './pages/dataLab';
import Layout from './components/layout'; // Sidebar layout wrapper
import ChangeUserDetailsPage from './pages/changeUserDetailsPage';
import FileUpload from './pages/fileUpload';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected routes: Main dashboard with sidebar */}
        <Route path="/MainPage" element={<Layout />}>
          <Route index element={<MainPage />} /> {/* Default page under MainPage */}
          <Route path="/MainPage/ChangeUserDetails" element={<ChangeUserDetailsPage />}/>
        </Route>
        <Route path="/Candidate" element={<Layout />}>
          <Route index element={<MainPage />} /> {/* Default page under MainPage */}
          <Route path="/Candidate/CreateCandidate" element={<FileUpload/>}/>
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
/*
          <Route path="profile/view" element={<ProfileView />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route path="network" element={<Network />} />
          <Route path="data-lab" element={<DataLab />} /> */
