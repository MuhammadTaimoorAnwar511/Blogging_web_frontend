import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(''); 
    // Inside your Register component


    const navigate = useNavigate();
    const { username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
 
    
    const onSubmit = async e => {
        e.preventDefault();
 
    
        try {
            const newUser = { username, email, password };
            await axios.post('http://localhost:3000/api/auth/register', newUser);
            navigate('/login');
           
        } catch (error) {
                    if (error.response && error.response.data) {
            // Check if the error is a duplicate key error
            if (error.response.data.message.includes('E11000')) {
                // Extract the field that caused the duplicate key error
                const field = error.response.data.message.split('index: ')[1].split(' dup key')[0].split('_')[0];
                setError(`An account with that ${field} already exists.`);
            } else {
                // Handle other errors
                setError(error.response.data.message);
            }
        } else {
            // Handle errors without a response (e.g., network errors)
            setError('An error occurred. Please try again.');
        }
        }
    };

    return (
        <form onSubmit={e => onSubmit(e)}>
            <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={e => onChange(e)}
                required
            />
            <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={e => onChange(e)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={e => onChange(e)}
                required
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
   
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
