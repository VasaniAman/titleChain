import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/forgot-password', { email });
      setMessage(response.data.message);
      navigate('/reset-password');
    } catch (error) {
      setMessage('Error occurred. Please try again later.');
      console.log(error);
    }
  };

  return (
  <div className="component">
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleFormSubmit}>
        <h2>Forgotten Password</h2>
        <div className="inputBox">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleEmailChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="btnF">Reset Password</button>
        <p className="message">{message}</p>
        <Link to="/login-page" className="link-btn">Back to Login?</Link>
      </form>
    </div>
    </div>
  );
};

export default ForgotPassword;