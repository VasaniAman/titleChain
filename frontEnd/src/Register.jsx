import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";


function Register() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false); // New state for reCAPTCHA verification
  const [passwordError, setPasswordError] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // State to track tooltip visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCaptchaVerified) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    if (!isPasswordValid(values.password)) {
      setPasswordError("Password must be at least 8 characters long and contain at least 1 uppercase letter and a number.");

          // Set a timer to clear the password error after 5 seconds
    setTimeout(() => {
      setPasswordError("");
      }, 4000);

      return;
    }

    axios.post('http://localhost:8081/register', values)
      .then(res => {
        if (res.data.Status === "Success") {
          alert("Registration successful. Please log in to access the home page.");
          navigate('/login-page');
        } else {
          alert("Error: The email may already be in use.");
        }
      })
      .catch(err => console.log(err));
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const handleRecaptchaChange = () => {
    setIsCaptchaVerified(true);
  };

  return (
    <div className="component">
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="inputBox">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputBox">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="example@example.com"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputBox">
          <label htmlFor="password">
            Password
            <span
              className="password-tooltip"
              style={{ display: isTooltipVisible ? "block" : "none" }}
            >
              Password should contain: 8 characters, at least 1 uppercase letter and number
            </span>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="info-icon"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </label>
          <input
            type="password"
            placeholder="*****"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>
        <div className="reCaptcha">
            <ReCAPTCHA
              sitekey="6LccU70mAAAAAKDf_O_qHtTvnLxKJ7j2XYpg5aCk"
              onChange={handleRecaptchaChange}
            />
          </div>
        <button type="submit" className="btnF">Register</button>
        <Link to="/login-page" className="link-btn2">
          Already have an account? Log In Here
        </Link>
      </form>
    </div>
  </div>
  );
}

export default Register;