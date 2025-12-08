"use client"

import React, { use, useState, useEffect } from 'react';



import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [apiKey, setApiKey] = useState(null);
  const [userName] = useState('John Doe');

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user && user.app.key_hash) {
        setApiKey(user.app.key_hash);
    }
    }, [user]);

  const generateApiKey = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/api_keys`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          //credentials: 'include',
          body: JSON.stringify({
            "user_id": user?.app.user_id,
            "name": user?.app.name
            }),
          
        });
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de la récupération de la clé API:', error);
      }
    };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key copiée !');
  };

  const stats = [
    { label: 'Requêtes aujourd\'hui', value: '1,234', color: '#FF4B2B' },
    { label: 'Requêtes ce mois', value: '45,678', color: '#FF416C' },
    { label: 'Projets actifs', value: '8', color: '#FF4B2B' }
  ];

  return (
    <ProtectedRoute>
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Montserrat:400,600,800');
        
        body {
          margin: 0;
          font-family: 'Montserrat', sans-serif;
          background: #f6f5f7;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Dashboard</h2>
        
        <nav style={styles.nav}>
          <button
            onClick={() => setActiveTab('home')}
            style={{
              ...styles.navButton,
              ...(activeTab === 'home' ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.icon}>🏠</span>
            Accueil
            <p>
                Bienvenue, {user?.app.name} !
            </p>
          </button>
          
          <button
            onClick={() => setActiveTab('generate')}
            style={{
              ...styles.navButton,
              ...(activeTab === 'generate' ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.icon}>🔑</span>
            Générer mon accès
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              ...styles.navButton,
              ...(activeTab === 'settings' ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.icon}>⚙️</span>
            Paramètres
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            {activeTab === 'home' && 'Accueil'}
            {activeTab === 'generate' && 'Générer mon accès'}
            {activeTab === 'settings' && 'Paramètres'}
          </h1>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{userName.charAt(0)}</div>
          </div>
        </div>

        <div style={styles.content}>
          {/* Accueil Tab */}
          {activeTab === 'home' && (
            <div style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div key={index} style={styles.statCard}>
                  <h3 style={styles.statValue}>{stat.value}</h3>
                  <p style={styles.statLabel}>{stat.label}</p>
                  <div style={{
                    ...styles.statBar,
                    background: `linear-gradient(135deg, ${stat.color} 0%, #FF416C 100%)`
                  }}></div>
                </div>
              ))}
            </div>
          )}

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div style={styles.generateSection}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Créer une nouvelle API Key</h2>
                <p style={styles.cardDescription}>
                  Générez une clé API pour accéder à nos services. Gardez cette clé en sécurité.
                </p>
                
                {!apiKey ? (
                  <button onClick={generateApiKey} style={styles.generateButton}>
                    Générer une clé API
                  </button>
                ) : (
                  <div style={styles.apiKeyContainer}>
                    <div style={styles.apiKeyBox}>
                      <code style={styles.apiKeyCode}>{apiKey}</code>
                    </div>
                    <button onClick={copyToClipboard} style={styles.copyButton}>
                      Copier
                    </button>
                    <button onClick={generateApiKey} style={styles.regenerateButton}>
                      Régénérer
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div style={styles.settingsSection}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Informations du compte</h2>
                
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Nom d'utilisateur</label>
                  <div style={styles.settingValue}>{user?.name}</div>
                </div>
                
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Statut de votre clé API</label>
                  {user?.app?.is_active ? (
                    <div style={styles.statusBadge}>
                      <span style={styles.statusDot}></span>
                      Actif
                    </div>
                  ) : (
                    <div style={styles.statusBadge}>
                      <span style={styles.statusDot}></span>
                      Inactif
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f6f5f7',
  },
  sidebar: {
    width: '280px',
    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
    padding: '40px 0',
    color: '#fff',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 60px 30px',
    letterSpacing: '1px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  navButton: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '18px 30px',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontFamily: 'Montserrat, sans-serif',
  },
  navButtonActive: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderLeft: '4px solid #fff',
  },
  icon: {
    fontSize: '20px',
  },
  mainContent: {
    flex: 1,
    padding: '0',
  },
  header: {
    background: '#fff',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '800',
    color: '#333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '800',
  },
  content: {
    padding: '40px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '15px',
    padding: '35px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  statValue: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 10px 0',
    color: '#333',
  },
  statLabel: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
    fontWeight: '600',
  },
  statBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '5px',
  },
  generateSection: {
    maxWidth: '700px',
  },
  card: {
    background: '#fff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '800',
    margin: '0 0 15px 0',
    color: '#333',
  },
  cardDescription: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 30px 0',
    lineHeight: '1.6',
  },
  generateButton: {
    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '800',
    padding: '18px 50px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'transform 0.2s ease',
    fontFamily: 'Montserrat, sans-serif',
  },
  apiKeyContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  apiKeyBox: {
    background: '#f6f5f7',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #eee',
  },
  apiKeyCode: {
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#333',
    wordBreak: 'break-all',
  },
  copyButton: {
    background: '#4CAF50',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '800',
    padding: '15px 40px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'transform 0.2s ease',
    fontFamily: 'Montserrat, sans-serif',
  },
  regenerateButton: {
    background: 'transparent',
    border: '2px solid #FF4B2B',
    borderRadius: '25px',
    color: '#FF4B2B',
    fontSize: '14px',
    fontWeight: '800',
    padding: '15px 40px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
    fontFamily: 'Montserrat, sans-serif',
  },
  settingsSection: {
    maxWidth: '700px',
  },
  settingItem: {
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #eee',
  },
  settingLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '800',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
  },
  settingValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: '#E8F5E9',
    color: '#4CAF50',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '600',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#4CAF50',
    animation: 'pulse 2s infinite',
  },
};