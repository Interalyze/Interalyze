import React, { useState } from 'react';
import FormContainer from '../components/formContainer';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ toggleForm }) => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      // Make API request to the backend
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Clear form fields and error message
        setEmail('');
        setPassword('');
        setErrorMessage('');

        // Redirect to MainPage
        navigate('/MainPage');
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.non_field_errors || 'Invalid email or password.'
        );
      }
    } catch (error) {
      // Handle network or other errors
      setErrorMessage('Unable to connect to the server. Please try again later.');
    }
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
