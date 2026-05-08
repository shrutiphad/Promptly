import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "./utils.js";
import "./Signup.css";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { username, email, password } = signupInfo;
    if (!username || !email || !password) {
      return handleError("Username, email and password are required");
    }

    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/signup`,
        signupInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.data;
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="auth-shell">
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-logo">P</div>
            <span className="auth-name">Promptly</span>
          </div>
          <p className="auth-subheading">Create your account</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab">Login</Link>
            <button type="button" className="auth-tab active">Sign Up</button>
          </div>

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-field">
              <label htmlFor="username">Full name</label>
              <input
                id="username"
                className="input auth-input"
                onChange={handleChange}
                type="text"
                name="username"
                autoFocus
                placeholder="Shruti Phad"
                value={signupInfo.username}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input auth-input"
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={signupInfo.email}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input auth-input"
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={signupInfo.password}
              />
            </div>

            <button type="submit" className="submit-btn auth-submit-btn">Create account →</button>
          </form>
        </div>

        <span className="auth-switch line">
          Already have one?
          <Link to="/login" className="passkey-login">Login</Link>
        </span>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
