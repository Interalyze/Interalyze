import React, { useState } from 'react';
import FormContainer from '../components/formContainer';

const SignUpPage = ({ toggleForm }) => {
  // State for email, password, and confirm password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setSuccessMessage('');
      return;
    }

    try {
      // Make API request to the backend
      const response = await fetch('/api/users/signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            confirm_password: confirmPassword,
        }),
    });

      if (response.ok) {
        // Clear form fields on successful registration
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setSuccessMessage('User registered successfully!');
      } else {
        // Handle errors returned by the backend
        const data = await response.json();
        setErrorMessage(
          data.email || data.password || 'An error occurred. Please try again.'
        );
        setSuccessMessage('');
      }
    } catch (error) {
      // Handle network or other errors
      setErrorMessage('Unable to connect to the server. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <FormContainer title="Sign Up">
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="alert error">{errorMessage}</p>}
        {successMessage && <p className="alert success">{successMessage}</p>}
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
        Already have an account?{' '}
        <button onClick={toggleForm} className="linkButton">
          Sign in
        </button>
      </p>
    </FormContainer>
  );
};

export default SignUpPage;

