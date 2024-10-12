import './App.css';
import Layout from './components/common/layout';
import { Router } from './components/routes';
import { useGoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import Login from './components/Login';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserProfileFromToken = (accessToken) => {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserInfo({
          name: data.name,
          email: data.email,
          picture: data.picture,
        });
      })
      .catch(error => console.error('Error fetching user info:', error));
    setIsAuthenticated(true)
    setIsLoggedIn(true);
  }

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (response) => {
      localStorage.setItem('authToken', response.access_token);
      fetchUserProfileFromToken(response.access_token)
    },
    onError: (error) => {
      console.error('Login Failed:', error)
      setIsAuthenticated(false)
    },
  });

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true)
      fetchUserProfileFromToken(token)
    } else {
      setIsLoggedIn(false)
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (

    <div>
      {isLoggedIn ? (<Layout userData={userInfo}>
        <Router />
      </Layout>) : (
        <Login handleLoginSuccess={handleGoogleSignIn} />
      )}
    </div>
  );
}

export default App;


