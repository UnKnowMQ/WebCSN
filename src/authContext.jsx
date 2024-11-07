import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if the user is logged in when the app loads
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:8081", { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setAuth(false);
      });
  }, []); 

  const login = (name) => {
    setAuth(true);
    setName(name);
  };

  const logout = () => {
    axios.get("http://localhost:8081/logout")
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(false);
          setName('');
        }
      })
      .catch(err => {
        console.error("Error logging out:", err);
      });
  };

  return (
    <AuthContext.Provider value={{ auth, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation for children only
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Only validate children prop
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};