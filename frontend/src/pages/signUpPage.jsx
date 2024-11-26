import React, { useState } from 'react';
import FormContainer from '../components/formContainer';

const SignUpPage = ({ toggleForm }) => {
  // State for email, password, and confirm password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Handle sign-up logic here
    console.log('Signing up with:', { email, password });
    setErrorMessage(''); // Clear error message after successful validation
  };

  return (
    <FormContainer title="Sign Up">
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="alert">{errorMessage}</p>}
        <label className="otherText">Email</label>
        <input
          className="textInput"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="otherText">Password</label>
        <input
          className="textInput"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="otherText">Confirm Password</label>
        <input
          className="textInput"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="outputButton" type="submit">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <button onClick={toggleForm}>Sign in</button>
      </p>
    </FormContainer>
  );
};

export default SignUpPage;
