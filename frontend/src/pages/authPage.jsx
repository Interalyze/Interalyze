import React, { useState } from 'react';
import LoginPage from './loginPage';
import SignUpPage from './signUpPage';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => setIsSignUp(!isSignUp);

  return (
    <div className="full-screen">
      {/* Sliding image section */}
      <div className={`image-section ${isSignUp ? 'move-right' : ''}`}>
        <div className="image-card"></div>
      </div>

      {/* Left (Sign-up Form) */}
      <div className={`left-section ${isSignUp ? '' : 'hidden'}`}>
        <SignUpPage toggleForm={toggleForm} />
      </div>

      {/* Right (Login Form) */}
      <div className={`right-section ${isSignUp ? 'hidden' : ''}`}>
        <LoginPage toggleForm={toggleForm} />
      </div>
    </div>
  );
};

export default AuthPage;
