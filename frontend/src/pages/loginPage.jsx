import React, { useState } from 'react';
import FormContainer from '../components/formContainer';
import { Form, Button, Alert } from 'react-bootstrap';
import { Navigate, Route, useNavigate } from 'react-router-dom';

const LoginPage = ({ toggleForm }) => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Handle login logic here
    console.log('Logging in with:', { email, password });
    setErrorMessage(''); // Clear error message after successful validation
    navigate('/MainPage');
  };

  return (
    <FormContainer title="Sign In">
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
            <Button variant="primary" className="outputButton" type="submit">
              Sign In
            </Button>
            
      {errorMessage && <Alert variant="danger" className='textInput' style={{}} >{errorMessage}</Alert>}
          </Form>
          <p>
        Need an account?{' '}
        <a className="blue-link" onClick={toggleForm}>
          Sign up
        </a>
      </p>
    </FormContainer>
  );
};

export default LoginPage;
