import React, { useState } from "react";
import {useEffect} from 'react';
import jwt_decode from "jwt-decode";
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import ForgotPassword from './ForgotPassword';
import { Navigate } from "react-router-dom";
import ResetPassword from './ResetPassword';
import Landing from './Landing';
import User from './User';
import Admin from './Admin';
import Issuer from './Issuer';
import Verifier from './Verifier';

function App() {

  const [ user, setUser ] = useState({});

  return(
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-page" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/issuer" element={<Issuer />} />
        <Route path="/verifier" element={<Verifier />} />
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;