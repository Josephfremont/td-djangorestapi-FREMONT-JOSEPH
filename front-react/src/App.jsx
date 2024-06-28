import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import LoginForm from './view/loginForm/LoginForm.jsx';
import Chercheurs from './view/chercheurs/Chercheurs.jsx';
import Projets from './view/projets/Projets.jsx';
import Publications from './view/publications/Publications.jsx';

const isAuthenticated = localStorage.getItem("token");
console.log(isAuthenticated);
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/chercheurs" element={<PrivateRoute><Chercheurs /></PrivateRoute>} />
          <Route path="/projetrecherches" element={<PrivateRoute><Projets /></PrivateRoute>} />
          <Route path="/publications" element={<PrivateRoute><Publications /></PrivateRoute>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/chercheurs" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Page sécurisée</h2>
      <p>Contenu confidentiel accessible uniquement aux utilisateurs authentifiés.</p>
    </div>
  );
}

function Header() {
  return (
    <>
      { isAuthenticated && isAuthenticated !== "token undefined"  && (
        <header style={{ backgroundColor: '#FFFFFF' }}>
          <nav>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '20px',
              paddingBottom: '20px',
              paddingLeft: '50px',
              paddingRight: '50px',
            }}>
              <Link to="/" className="font-semibold text-xl">
                <img src="./Django_logo.svg.png" alt='Django' style={{ height: 80, width: "auto" }} />
              </Link>
              <ul className="nav-links" style={{
                display: 'flex',
                gap: "90px",
                color: "#4A484B",
                alignItems: 'center',
                fontSize: 30,
                alignSelf: 'center',
                fontFamily: 'N27-Regular'
              }}>
                <li><Link to="/chercheurs">Chercheurs</Link></li>
                <li><Link to="/projetrecherches">Projet recherches</Link></li>
                <li><Link to="/publications">Publications</Link></li>
                <li style={{ color: "#ffb5b5" }}><Link to="/login">Déconnexion</Link></li>
              </ul>
            </div>
          </nav>
        </header>
      )}
    </>
  );
}

function PrivateRoute({ children }) {
  // const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated && isAuthenticated !== "token undefined"  ? children : <Navigate to="/login" />;
}

export default App;
