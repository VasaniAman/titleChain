import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function ResetPassword() {
  const [values, setValues] = useState({
    tempPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { tempPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least 1 uppercase letter and a number."
      );

      // Set a timer to clear the password error after 5 seconds
      setTimeout(() => {
        setPasswordError("");
      }, 4000);

      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/reset-password",
        {
          tempPassword,
          newPassword
        }
      );
      setMessage(response.data.message);
      setValues({
        tempPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setMessage("Error occurred. Please try again later.");
      console.log(error);
    }
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

  return (
    <div className="component">
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <div className="inputBox">
          <label htmlFor="password">Password from Email</label>
          <input
            type="password"
            placeholder="Enter Password from Email"
            name="tempPassword"
            value={values.tempPassword}
            onChange={handleChange}
          />
        </div>
        <div className="inputBox">
          <label htmlFor="newPassword">
            New Password
            <span
              className="password-tooltip"
              style={{ display: isTooltipVisible ? "block" : "none" }}
            >
              Password should contain: 8 characters, at least 1 uppercase letter and number
            </span>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="info-icon1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </label>
          <input
            type="password"
            placeholder="Enter New Password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
          />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>
        <div className="inputBox">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btnF">
          Submit
        </button>
        <p className="message">{message}</p>
        <Link to="/login-page" className="link-btn">
          Back to Login
        </Link>
      </form>
    </div>
  </div>
  );
}

export default ResetPassword;