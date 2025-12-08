"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Si le token existe déjà en mémoire, pas besoin d'appeler l'API
      if (accessToken && user) {
        console.log('Token existant, utilisateur déjà authentifié');
        setLoading(false);
        return;
      }

      // Sinon, vérifier auprès de l'API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/app/info`, {
        //credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User authenticated:', data);
        setUser(data);
        
        // Sauvegarder le token si présent
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error('Erreur de vérification auth:', error);
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (name, password) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/app/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //credentials: 'include',
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data);
      
      // Sauvegarder le token
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Erreur de connexion' };
    }
  };

  const register = async (name, password) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/app/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //credentials: 'include',
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data);
      
      // Sauvegarder le token
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Erreur lors de la création du compte' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/app/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};