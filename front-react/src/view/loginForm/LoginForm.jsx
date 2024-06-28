import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import './LoginForm.css';
import getTokenAuthentification from '../../api/getTokenAuthentification.jsx'
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const isAuthenticated = localStorage.getItem("token");
  console.log('isAuthenticated ', isAuthenticated)
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    console.log(`User: ${user}, Mot de passe: ${password}`);
    getTokenAuthentification(user, password).then((data) => {
      localStorage.setItem("token", 'token ' + data.token);
      navigate("/chercheurs");
      window.location.reload()
    }).catch((error) => {
      console.error('Error fetching token:', error);
      setErrorMessage('Speudonyme ou mot de passe invalide');
    });
  };

  const handleSubmitFormDeconnexion = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className='page'>
      {isAuthenticated && isAuthenticated !== "token undefined" ? (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'center' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ width: 200, marginTop: '24px' }}
            onClick={handleSubmitFormDeconnexion}
          >
            Se déconnecter
          </Button>
        </div>
      ) : (
        <Container component="main" maxWidth="xs">
          <div className="form-container">
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <form style={{ width: '100%', marginTop: '8px' }} onSubmit={handleSubmitForm}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user"
                label="username"
                name="user"
                autoComplete="user"
                autoFocus
                value={user}
                onChange={handleUserChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
              />
              {isAuthenticated == "token undefined" && <p>{"errorMessage"}</p>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: '24px' }}
              >
                Connexion
              </Button>
            </form>
          </div>
        </Container>
      )}
    </div>
  );
}

export default LoginForm;
