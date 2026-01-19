import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from './utils.js';
import './Login.css';


function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }


        try {
            const url = "http://localhost:8080/api/login";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);

              localStorage.setItem('token', jwtToken);
              localStorage.setItem('loggedInUser', name);
                //setIsAuthenticated(true);
                setTimeout(() => {
                    navigate('/chat')
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
    }

    return (
        <div className='login-container'> 
            <h1 style={{fontStyle: "italic" }}>Welcome back to PROMPTLY  <i className="fa-solid fa-robot"> </i>  </h1>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div >
                <div>
                        <label htmlFor='email'>Email</label>
                        <p></p>
                    <input
                        className='input'
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                    </div>
                    <p></p>
                <div>
                        <label htmlFor='password'>Password</label>
                        <p></p>
                    <input className='input'
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                </div>
                <div className='main'>
                <button type='submit' className='submit-btn' >Login</button>
                <span className='line' >  Dont have an account ?
                    <Link to="/signup" className='passkey-signup '>Signup</Link>
                    </span>
                    </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login