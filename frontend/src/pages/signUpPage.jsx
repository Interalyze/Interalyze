import React, { useState } from 'react';

import { Form, Button, Alert } from 'react-bootstrap';
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
      <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" >
              <Form.Control
              className="textInput"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" >
              <Form.Control
                className="textInput"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" >
              <Form.Control
                className="textInput"
                type="password"
                placeholder="Enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="outputButton" type="submit">
              Sign Up
            </Button>
            
      {errorMessage && <Alert variant="danger" className='textInput' style={{}} >{errorMessage}</Alert>}
          </Form>
          <p>
        Already have an account?{' '}
        <a className="blue-link" onClick={toggleForm}>
          Sign in
        </a>
      </p>
    </FormContainer>
  );
};

export default SignUpPage;
