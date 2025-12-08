"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import './style.css';

export default function Home() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  
  // États pour l'inscription
  const [signupName, setSignupName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  // États pour la connexion
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // États pour les messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const togglePanel = () => {
    setIsRightPanelActive(!isRightPanelActive);
    setMessage('');
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await register(signupName, signupPassword);

      if (result.success) {
        setMessage('Compte créé avec succès !');
        setSignupName('');
        setSignupPassword('');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await login(loginName, loginPassword);

      if (result.success) {
        console.log('Login successful');
        setMessage('Connexion réussie !');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      {/* Formulaire d'inscription */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <h1>Créer un compte</h1>
          <div className="social-container"></div>
          
          {error && !isRightPanelActive && <p style={{color: 'red', fontSize: '14px', marginTop: '10px'}}>{error}</p>}
          {message && !isRightPanelActive && <p style={{color: 'green', fontSize: '14px', marginTop: '10px'}}>{message}</p>}
          
          <input 
            type="text" 
            placeholder="Nom" 
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            required
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <div className="social-container"></div>
          <button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Créer un compte'}
          </button>
        </form>
      </div>

      {/* Formulaire de connexion */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Connexion</h1> 
          <div className="social-container"></div>
          
          {error && isRightPanelActive && <p style={{color: 'red', fontSize: '14px', marginTop: '10px'}}>{error}</p>}
          {message && isRightPanelActive && <p style={{color: 'green', fontSize: '14px', marginTop: '10px'}}>{message}</p>}
          
          <input 
            type="text" 
            placeholder="Nom" 
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            disabled={loading}
          />
          <a href="#">Mot de passe oublié?</a>
          <button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Bienvenue !</h1>
            <p>Connectez-vous avec vos informations personnelles</p>
            <button className="ghost" onClick={togglePanel} type="button">Se connecter</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Bonjour !</h1>
            <p>Entrez vos informations personnelles et commencez votre voyage avec nous</p>
            <button className="ghost" onClick={togglePanel} type="button">Créer un compte</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/page.js - Sauvegardez ce fichier dans app/page.js