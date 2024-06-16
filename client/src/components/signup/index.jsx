import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css"; 
import image1 from "../../assets/connectify.png";

export default function Signup() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!username || !email || !password) {
          setEmptyFields(true);
          return;
      }

      try {
          const response = await axios.post('http://localhost:5000/api/auth/signup', {
            username: username,
              email: email,
              password: password,
          });
          console.log('Registration successful:', response.data);
          
          setShowPopup(true);
      } catch (error) {
          if (error.response) {
              console.error('Registration error:', error.response.data);
          } else {
              console.error('Request failed:', error.message);
          }
      }
  };

  const handleOkClick = () => {
      setShowPopup(false);
      navigate('/login'); 
  };

  return (
    <div className="Signup">
      <div className={`signupcard ${showPopup ? 'blur-background' : ''}`}>
        <img src={image1} height={450} width={420} alt="Connectify Logo" />
        <form className="signup-form" onSubmit={handleSubmit}>
            <p className="heading">Create an Account</p>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Username" 
              name="name" 
              value={username} 
              onChange={(e) => setUserName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
          <button type="submit">Sign Up</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
      {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <p className='registrationloginSuccess'>Registration successful!</p>
                        <p>Please Login to continue</p>
                        <button className="ok-btn" onClick={handleOkClick}>OK</button>
                    </div>
                </div>
      )}
    </div>
  );
}
