import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './App.css';
import jwt_decode from "jwt-decode";

function Login() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleCallbackResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  };

  const handlesignOut = (e) => {
    setUser(null);
    document.getElementById("signInDiv").hidden = false;
    navigate('/landing');
  };

  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/login', values)
      .then(res => {
        if (res.data.Status === "Success") {
          const { user } = res.data;
          setUser(user);
          navigate(`/${user.role}`);
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (user && user.name) {
      navigate(`/${user.role}`);
    }

    /* global google */
    google.accounts.id.initialize({
      client_id: "631866210287-v1gc5bjrmfs9ho3vsptkne3ijh9iurmh.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "filled_white", size: "large" }
    );
  }, []);

  return (
    <div className="component">
      <div className="auth-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="inputBox">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="example@example.com"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="inputBox">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="****"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btnF">Login</button>
          <div className="google-signin-container">
            <div id="signInDiv"></div>
          </div>
          <Link to="/" className="link-btn2">Back Home?</Link>
          <Link to="/register" className="link-btn">Don't have an account? Register Here</Link>
          <Link to="/forgot-password" className="link-btn1">Forgot Password?</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
