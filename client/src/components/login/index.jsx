import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import image1 from "../../assets/connectify.png";
import { useAuth } from '../Auth/AuthContext.jsx';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvalidEmail(false);
    setInvalidPassword(false);
    setEmptyFields(false);

    if (!username || !password) {
      setEmptyFields(true);
      return;
    }

    try {
      console.log('Sending login request with username:', username, 'and password:', password); // Debugging log
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: username,
        password: password,
      });
      console.log('Login successful:', response.data);
      setAuth({ user: response.data.result, token: response.data.token });
      localStorage.setItem('auth', JSON.stringify(response.data));
      // Show popup on successful login
      setShowPopup(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Invalid email or password
        setInvalidEmail(true);
        setInvalidPassword(true);
      } else {
        console.error('Request failed:', error.message);
      }
    }
  };

  const handleOkClick = () => {
    setShowPopup(false);
    navigate('/');
  };

  return (
    <div className="Signup">
      <div className="signupcard">
        <img src={image1} height={450} width={420} alt="Connectify Logo" />
        <form className="signup-form" onSubmit={handleSubmit}>
          <p className="heading">Welcome Back!</p>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign In</button>
          <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </form>
      </div>
      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <p className='registrationloginSuccess'>Login successful!</p>
            <button className="ok-btn" onClick={handleOkClick}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
