"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './style.css'

export default function Home() {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  
  const [signupName, setSignupName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/app/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupName,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Compte créé avec succès !');
        setSignupName('');
        setSignupPassword('');
        
        // Connexion automatique après inscription
        const result = await signIn('credentials', {
          name: signupName,
          password: signupPassword,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Erreur lors de la création du compte');
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
      const result = await signIn('credentials', {
        name: loginName,
        password: loginPassword,
        redirect: false,
      });

      if (result?.ok) {
        setMessage('Connexion réussie !');
        router.push('/dashboard');
      } else {
        setError('Nom ou mot de passe incorrect');
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
          
          {error && !isRightPanelActive && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
          {message && !isRightPanelActive && <p style={{color: 'green', fontSize: '14px'}}>{message}</p>}
          
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
          
          {error && isRightPanelActive && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
          {message && isRightPanelActive && <p style={{color: 'green', fontSize: '14px'}}>{message}</p>}
          
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
            <p>Veuillez créer votre compte avec vos informations personnelles</p>
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