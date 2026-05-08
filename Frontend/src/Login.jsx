import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "./utils.js";
import axios from "axios";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      // const url = axios.get ("https://promptly-ezg2.onrender.com");
      // const response = await fetch(url, {
      //   method: "POST",
      //   },
      //   body: JSON.stringify(loginInfo),
      // });

      // const result = await response.json();
      const response = await axios.post(
        `${API_URL}/api/login`,
        loginInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const result = response.data;
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/chat");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="auth-shell">
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-logo">P</div>
            <span className="auth-name">Promptly</span>
          </div>
          <p className="auth-subheading">Login in to continue</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button type="button" className="auth-tab active">Login</button>
            <Link to="/signup" className="auth-tab">Sign Up</Link>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input auth-input"
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginInfo.email}
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">Password</label>
              </div>
              <input
                id="password"
                className="input auth-input"
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginInfo.password}
              />
            </div>

            <button type="submit" className="submit-btn auth-submit-btn"> Login →</button>
          </form>
        </div>

        <span className="auth-switch line">
          No account?
          <Link to="/signup" className="passkey-signup">Sign up free</Link>
        </span>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
