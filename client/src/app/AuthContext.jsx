import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ApiError } from '../lib/api.js';
import {
  firebaseLoginUser,
  firebaseRegisterUser,
  firebaseLoginWithGoogle,
  firebaseLogoutUser,
  syncUserProfileToFirestore,
  formatFirebaseError,
  onFirebaseAuthStateChanged
} from '../lib/firebase.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for Firebase Auth changes
    const unsubscribe = onFirebaseAuthStateChanged(async (fbUser) => {
      if (fbUser && !user) {
        try {
          const res = await api.post('/auth/firebase-sync', {
            firebaseUid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split('@')[0],
            avatarUrl: fbUser.photoURL || ''
          });
          if (res.user) setUser(res.user);
        } catch {
          // Handled silently
        }
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      // 1. Authenticate with Firebase Auth
      let fbUser = null;
      try {
        const cred = await firebaseLoginUser(email, password);
        fbUser = cred.user;
      } catch (fbErr) {
        // Fallback for seeded demonstration accounts (e.g. coordinator/admin)
        if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
          const res = await api.post('/auth/login', { email, password });
          setUser(res.user);
          return res.user;
        }
        throw new Error(formatFirebaseError(fbErr));
      }

      // 2. Sync to Firestore
      if (fbUser) {
        await syncUserProfileToFirestore(fbUser.uid, {
          email: fbUser.email,
          lastLoginAt: new Date().toISOString()
        });

        // 3. Sync to Backend API
        const res = await api.post('/auth/firebase-sync', {
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email?.split('@')[0]
        });
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      // 1. Register account in Firebase Auth
      let fbUser = null;
      try {
        const cred = await firebaseRegisterUser(formData.email, formData.password);
        fbUser = cred.user;
      } catch (fbErr) {
        throw new Error(formatFirebaseError(fbErr));
      }

      // 2. Store full student profile in Cloud Firestore
      if (fbUser) {
        await syncUserProfileToFirestore(fbUser.uid, {
          uid: fbUser.uid,
          name: formData.name,
          email: formData.email,
          department: formData.department || 'Computer Applications',
          academicYear: formData.academicYear || 'TY',
          preferredLearningFormat: formData.preferredLearningFormat || 'flexible',
          role: 'student',
          createdAt: new Date().toISOString()
        });

        // 3. Synchronize with Backend API for matching graph and sessions
        const res = await api.post('/auth/firebase-sync', {
          firebaseUid: fbUser.uid,
          email: formData.email,
          name: formData.name,
          department: formData.department,
          academicYear: formData.academicYear,
          preferredLearningFormat: formData.preferredLearningFormat
        });
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      const message = err.message || 'Registration failed.';
      setError(message);
      throw new Error(message);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      // 1. Authenticate with Google via Firebase Popup
      const result = await firebaseLoginWithGoogle();
      const fbUser = result.user;

      // 2. Save/Update Profile in Cloud Firestore
      await syncUserProfileToFirestore(fbUser.uid, {
        uid: fbUser.uid,
        name: fbUser.displayName || 'Google Student',
        email: fbUser.email,
        avatarUrl: fbUser.photoURL || '',
        department: 'Computer Applications',
        academicYear: 'TY',
        role: 'student',
        lastLoginAt: new Date().toISOString()
      });

      // 3. Synchronize with Backend API
      const res = await api.post('/auth/firebase-sync', {
        firebaseUid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || 'Google Student',
        avatarUrl: fbUser.photoURL || '',
        department: 'Computer Applications',
        academicYear: 'TY',
        preferredLearningFormat: 'flexible'
      });
      setUser(res.user);
      return res.user;
    } catch (err) {
      const message = formatFirebaseError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await firebaseLogoutUser().catch(() => {});
      await api.post('/auth/logout').catch(() => {});
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.user) setUser(res.user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isCoordinator: user?.role === 'coordinator' || user?.role === 'admin',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
