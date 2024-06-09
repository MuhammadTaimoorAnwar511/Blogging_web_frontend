import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';

import { jwtDecode } from 'jwt-decode';

import '../Style/Login.css'; 

const Login = () => {
    // Initialize the formData state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // useNavigate hook for redirecting to different routes
    const navigate = useNavigate();

    // Update formData state when input fields change
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const onSubmit = async e => {
        e.preventDefault();
        // Extract email and password from formData
        const { email, password } = formData;
        
        try {
            // Post to the login endpoint with email and password
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });
           
            // Destructure token, role, and id from the response data
            const { token} = response.data;
            const decoded = jwtDecode(token);
            const id = decoded.id;
            const role = decoded.role;
            const username = decoded.username;
            // Store token and id in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', id);
            localStorage.setItem('userName', username);
         

            // Redirect based on the role
            if (role === 'user') 
            {
                // Display a success alert
                navigate('/userhome');
               //navigate(`/userhome?token=${token}`);
            } 
            else if (role === 'admin') 
            {
                // Display a success alert                
                navigate('/adminhome');
            }
        } catch (error) {
            // Handle errors, such as displaying a login failure message
            console.error('Login error:', error.response.data);
            alert('ERROR');
            // Add any error handling logic here, such as setting an error message in state
        }
    };
    // New state to manage the OTP alert
    const [otpAlert, setOtpAlert] = useState(false);

    // Effect to clear the OTP alert after a certain time
    useEffect(() => {
        if (otpAlert) {
            const timer = setTimeout(() => {
                setOtpAlert(false);
            }, 5000); // Adjust the time as needed (5000 milliseconds = 5 seconds)
            
            // Clear the timer when the component unmounts
            return () => clearTimeout(timer);
        }
    }, [otpAlert]);

    // Render the login form
    return (
        <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    required
                />
                <button type="submit" className="login-button">Login</button>
                <a href="#" onClick={() => setOtpAlert(true)}>Forgot Password?</a>
                {otpAlert && <div className="otp-alert">OTP sent to email!</div>}
                
            </div>
            <div className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </div>
        </form>
    );
};

export default Login;
