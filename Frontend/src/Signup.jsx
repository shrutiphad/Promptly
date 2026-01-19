import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "./utils.js";
import './Signup.css';

function Signup() {

  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password:"",
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // const copySignupInfo = { ...signupInfo };
    // copySignupInfo[name] = value;
    // setSignupInfo(copySignupInfo);
    setSignupInfo({ ...signupInfo, [name]: value });
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    const { username, email, password } = signupInfo;

    if (!username || !email || !password) {
      return handleError('username, email and password are required')
    }
    
    try {
      const url = "http://localhost:8080/api/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
    
    
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <div className="signup-container">
      <h1 style={{fontStyle: "italic" }}>Welcome to PROMPTLY  <i className="fa-solid fa-robot"> </i>  </h1>
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="name">Userame</label>
            <p></p>
            <input
              onChange={handleChange}
              type='text'
              name="username"
              autoFocus
              placeholder="Enter your username"
              value={signupInfo.username}
            />
          </div>
          <p></p>
          <div>
            <label htmlFor="email">Email</label>
            <p></p>
            <input
              onChange={handleChange}
              type='email'
              name="email"
              placeholder="Add your email"
              value={signupInfo.email}
            />
          </div>
          <p></p>
          <div>
            <label htmlFor="password">Password</label>
            <p></p>
            <input
              onChange={handleChange}
              type='password'
              name="password"
              placeholder="Set your password"
              value={signupInfo.password}
            />
          </div>
          <button type="submit" className="submit-btn">Signup</button>
          <span className='line'>Already have an account ?
            <Link to="/login" className='passkey-login'> Login Now</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}
export default Signup;
