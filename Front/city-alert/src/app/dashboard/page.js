"use client"

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [apiKey, setApiKey] = useState(null);
  const [userName] = useState('John Doe');
  const [hoveredStat, setHoveredStat] = useState(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user && user.app?.key_hash) {
        setApiKey(user?.app?.key_hash);
    }
    }, [user]);

  const generateApiKey = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/api_keys`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
    { label: 'Requêtes aujourd\'hui', value: '1,234', color: '#FF4B2B', icon: '📊', change: '+12%' },
    { label: 'Requêtes ce mois', value: '45,678', color: '#FF416C', icon: '📈', change: '+28%' },
    { label: 'Projets actifs', value: '8', color: '#FF4B2B', icon: '🚀', change: '+2' }
  ];

  return (
    <ProtectedRoute>
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: #0f0f1e;
          color: #fff;
        }
        
        * {
          box-sizing: border-box;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .nav-button:hover {
          transform: translateX(5px);
        }

        .generate-button:hover, .copy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 75, 43, 0.4);
        }

        .regenerate-button:hover {
          background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%);
          color: #fff;
          transform: translateY(-2px);
        }
      `}</style>

      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>⚡</div>
          <h2 style={styles.logo}>Dashboard</h2>
        </div>
        
        <nav style={styles.nav}>
          <button
            onClick={() => setActiveTab('home')}
            className="nav-button"
            style={{
              ...styles.navButton,
              ...(activeTab === 'home' ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.icon}>🏠</span>
            <div style={styles.navTextContainer}>
              <span style={styles.navLabel}>Accueil</span>
              <span style={styles.navSubtext}>Vue d'ensemble</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('generate')}
            className="nav-button"
            style={{
              ...styles.navButton,
              ...(activeTab === 'generate' ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.icon}>🔑</span>
            <div style={styles.navTextContainer}>
              <span style={styles.navLabel}>API Key</span>
              <span style={styles.navSubtext}>Générer un accès</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className="nav-button"
            style={{
              ...styles.navButton,
              ...(activeTab === 'settings' ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.icon}>⚙️</span>
            <div style={styles.navTextContainer}>
              <span style={styles.navLabel}>Paramètres</span>
              <span style={styles.navSubtext}>Configuration</span>
            </div>
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>{user?.app?.name?.charAt(0) || 'U'}</div>
            <div>
              <div style={styles.userCardName}>{user?.app?.name || 'Utilisateur'}</div>
              <div style={styles.userCardRole}>Développeur</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              {activeTab === 'home' && 'Bienvenue 👋'}
              {activeTab === 'generate' && 'Gestion des accès 🔑'}
              {activeTab === 'settings' && 'Paramètres ⚙️'}
            </h1>
            <p style={styles.headerSubtitle}>
              {activeTab === 'home' && 'Voici un aperçu de votre activité'}
              {activeTab === 'generate' && 'Créez et gérez vos clés d\'API'}
              {activeTab === 'settings' && 'Gérez les paramètres de votre compte'}
            </p>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.notificationButton}>
              🔔
              <span style={styles.notificationBadge}>3</span>
            </button>
          </div>
        </div>

        <div style={styles.content}>
          {activeTab === 'home' && (
            <>
              <div style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="stat-card"
                    style={styles.statCard}
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div style={styles.statHeader}>
                      <span style={styles.statIcon}>{stat.icon}</span>
                      <span style={styles.statChange}>{stat.change}</span>
                    </div>
                    <h3 style={styles.statValue}>{stat.value}</h3>
                    <p style={styles.statLabel}>{stat.label}</p>
                    <div style={{
                      ...styles.statBar,
                      background: `linear-gradient(135deg, ${stat.color} 0%, #FF416C 100%)`,
                      opacity: hoveredStat === index ? 1 : 0.7
                    }}></div>
                  </div>
                ))}
              </div>

              <div style={styles.activitySection}>
                <h2 style={styles.sectionTitle}>Activité récente</h2>
                <div style={styles.activityCard}>
                  {[
                    { action: 'Requête API effectuée', time: 'Il y a 2 minutes', icon: '✅' },
                    { action: 'Nouvelle clé générée', time: 'Il y a 1 heure', icon: '🔑' },
                    { action: 'Paramètres mis à jour', time: 'Il y a 3 heures', icon: '⚙️' }
                  ].map((activity, i) => (
                    <div key={i} style={styles.activityItem}>
                      <span style={styles.activityIcon}>{activity.icon}</span>
                      <div style={styles.activityContent}>
                        <div style={styles.activityAction}>{activity.action}</div>
                        <div style={styles.activityTime}>{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'generate' && (
            <div style={styles.generateSection}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardIconWrapper}>
                    <span style={styles.cardIcon}>🔐</span>
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>Clé API</h2>
                    <p style={styles.cardDescription}>
                      Générez une clé API sécurisée pour accéder à nos services.
                    </p>
                  </div>
                </div>
                
                {!apiKey ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🔑</div>
                    <p style={styles.emptyText}>Vous n'avez pas encore de clé API</p>
                    <button onClick={generateApiKey} className="generate-button" style={styles.generateButton}>
                      Générer ma clé API
                    </button>
                  </div>
                ) : (
                  <div style={styles.apiKeyContainer}>
                    <div style={styles.apiKeyLabel}>Votre clé API</div>
                    <div style={styles.apiKeyBox}>
                      <code style={styles.apiKeyCode}>{apiKey}</code>
                    </div>
                    <div style={styles.buttonGroup}>
                      <button onClick={copyToClipboard} className="copy-button" style={styles.copyButton}>
                        📋 Copier
                      </button>
                      <button onClick={generateApiKey} className="regenerate-button" style={styles.regenerateButton}>
                        🔄 Régénérer
                      </button>
                    </div>
                    <div style={styles.warningBox}>
                      <span style={styles.warningIcon}>⚠️</span>
                      <span style={styles.warningText}>Gardez cette clé secrète</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={styles.settingsSection}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Informations du compte</h2>
                
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Nom d'utilisateur</label>
                  <div style={styles.settingValueBox}>
                    <span style={styles.settingValue}>{user?.app?.name}</span>
                  </div>
                </div>
                
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Statut du compte</label>
                  {user?.app?.is_active ? (
                    <div style={styles.statusBadgeActive}>
                      <span style={styles.statusDot}></span>
                      Actif
                    </div>
                  ) : (
                    <div style={styles.statusBadgeInactive}>
                      <span style={styles.statusDotInactive}></span>
                      Inactif
                    </div>
                  )}
                </div>

                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>ID Utilisateur</label>
                  <div style={styles.settingValueBox}>
                    <code style={styles.settingCode}>{user?.app?.user_id}</code>
                  </div>
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
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f1e' },
  sidebar: { width: '300px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', padding: '30px 0', color: '#fff', boxShadow: '4px 0 20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255, 255, 255, 0.1)' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '15px', margin: '0 0 50px 30px' },
  logoIcon: { fontSize: '32px', background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(255, 75, 43, 0.3)' },
  logo: { fontSize: '24px', fontWeight: '800', margin: '0', letterSpacing: '0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navButton: { background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.7)', padding: '16px 30px', textAlign: 'left', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'Inter, sans-serif', borderLeft: '3px solid transparent' },
  navButtonActive: { background: 'rgba(255, 75, 43, 0.15)', borderLeft: '3px solid #FF4B2B', color: '#fff' },
  navTextContainer: { display: 'flex', flexDirection: 'column', gap: '2px' },
  navLabel: { fontSize: '15px', fontWeight: '600' },
  navSubtext: { fontSize: '12px', opacity: 0.6 },
  icon: { fontSize: '22px' },
  sidebarFooter: { padding: '0 20px', marginTop: 'auto' },
  userCard: { background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  userAvatar: { width: '45px', height: '45px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800' },
  userCardName: { fontSize: '14px', fontWeight: '700', marginBottom: '2px' },
  userCardRole: { fontSize: '12px', opacity: 0.6 },
  mainContent: { flex: 1, backgroundColor: '#0f0f1e' },
  header: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '40px 50px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { margin: '0 0 8px 0', fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  headerSubtitle: { margin: 0, fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' },
  headerActions: { display: 'flex', gap: '15px' },
  notificationButton: { background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' },
  notificationBadge: { position: 'absolute', top: '8px', right: '8px', background: '#FF4B2B', color: '#fff', fontSize: '10px', fontWeight: '700', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  content: { padding: '40px 50px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' },
  statCard: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  statIcon: { fontSize: '32px', filter: 'drop-shadow(0 4px 8px rgba(255, 75, 43, 0.3))' },
  statChange: { background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' },
  statValue: { fontSize: '48px', fontWeight: '800', margin: '0 0 10px 0', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statLabel: { fontSize: '15px', color: 'rgba(255, 255, 255, 0.6)', margin: 0, fontWeight: '600' },
  statBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', transition: 'opacity 0.3s ease' },
  activitySection: { marginTop: '40px' },
  sectionTitle: { fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '20px' },
  activityCard: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px', padding: '25px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  activityItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' },
  activityIcon: { fontSize: '24px', background: 'rgba(255, 75, 43, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  activityContent: { flex: 1 },
  activityAction: { fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' },
  activityTime: { fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' },
  generateSection: { maxWidth: '800px' },
  card: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  cardHeader: { display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-start' },
  cardIconWrapper: { background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(255, 75, 43, 0.3)' },
  cardIcon: { fontSize: '28px' },
  cardTitle: { fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', color: '#fff' },
  cardDescription: { fontSize: '15px', color: 'rgba(255, 255, 255, 0.6)', margin: '0', lineHeight: '1.6' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '20px', opacity: 0.5 },
  emptyText: { fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '30px' },
  generateButton: { background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: '700', padding: '18px 40px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s ease', fontFamily: 'Inter, sans-serif', boxShadow: '0 8px 20px rgba(255, 75, 43, 0.3)' },
  apiKeyContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  apiKeyLabel: { fontSize: '14px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '1px' },
  apiKeyBox: { background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  apiKeyCode: { fontSize: '14px', fontFamily: 'monospace', color: '#4CAF50', wordBreak: 'break-all', lineHeight: '1.6' },
  buttonGroup: { display: 'flex', gap: '15px' },
  copyButton: { background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: '700', padding: '15px 30px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s ease', fontFamily: 'Inter, sans-serif', flex: 1, boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)' },
  regenerateButton: { background: 'transparent', border: '2px solid rgba(255, 75, 43, 0.5)', borderRadius: '12px', color: '#FF4B2B', fontSize: '14px', fontWeight: '700', padding: '15px 30px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s ease', fontFamily: 'Inter, sans-serif', flex: 1 },
  warningBox: { background: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.3)', borderRadius: '12px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px' },
  warningIcon: { fontSize: '20px' },
  warningText: { fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' },
  settingsSection: { maxWidth: '800px' },
  settingItem: { marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
  settingLabel: { display: 'block', fontSize: '13px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
  settingValueBox: { background: 'rgba(0, 0, 0, 0.2)', padding: '15px 20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  settingValue: { fontSize: '16px', fontWeight: '600', color: '#fff' },
  settingCode: { fontSize: '14px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.8)' },
  statusBadgeActive: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', padding: '12px 20px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', border: '1px solid rgba(76, 175, 80, 0.3)' },
  statusBadgeInactive: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(244, 67, 54, 0.2)', color: '#f44336', padding: '12px 20px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', border: '1px solid rgba(244, 67, 54, 0.3)' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#4CAF50', animation: 'pulse 2s infinite' },
  statusDotInactive: { width: '10px', height: '10px', borderRadius: '50%', background: '#f44336' }
};