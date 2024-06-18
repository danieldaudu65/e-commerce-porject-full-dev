import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [state, setState] = useState('Login to Account');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:4000/adminauth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', data.token);
        alert('Sign up successful');
        navigate('/');
        setState('Login to Account')
      } else {
        alert(data.msg || 'Sign up failed. Please check your details and try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred during sign up. Please try again later.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/adminauth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', data.token);
        alert('Log In successful');
        navigate('/home');
      } else {
        alert(data.msg || 'Log in failed. Please check your details and try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during log in. Please try again later.');
    }
  };

  return (
    <div className='signin'>
      <span className="cart_logo">Cart</span>
      <h3>{state}</h3>
      <p>Please Put In Your Details to Get Started with Cart</p>
      <div className='form'>
        {state === "Create a Cart Account" && (
          <input
            type="text"
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Full Name'
            required
            autoComplete='true'
          />
        )}
        <input
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Email'
          required
          autoComplete='true'
        />
        <input
          type="password"
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Password'
          required
          autoComplete='true'
        />
        {state === 'Create a Cart Account'
          ? <button type="button" onClick={handleSignup}>Sign Up</button>
          : <button type="button" onClick={handleLogin}>Log In</button>
        }
      </div>
      {state === "Create a Cart Account"
        ? <p className='click-here-sign-log'>Already have an Account? <span onClick={() => setState("Login to Account")}>Login here</span></p>
        : <p className='click-here-sign-log'>Create an Account? <span onClick={() => setState('Create a Cart Account')}>Click here</span></p>
      }
    </div>
  );
};

export default Signup;
