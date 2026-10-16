import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '../lib/api.js';

const SkillSwapContext = createContext(null);

export const SkillSwapProvider = ({ children }) => {
  // Mobile frame simulator toggle ('desktop' or 'mobile-sim')
  const [deviceView, setDeviceView] = useState('desktop');

  // Active Modals: null | 'swap-request' | 'schedule-session' | 'rate-review' | 'circle-celebration' | 'screen-navigator'
  const [activeModal, setActiveModal] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);

  // Current user state with localStorage persistence (no hardcoded dummy defaults)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading user from localStorage', e);
    }
    return {
      id: 'user-' + Date.now(),
      name: '',
      handle: '',
      email: '',
      college: '',
      branch: '',
      bio: '',
      avatar: '',
      photoSource: null,
      reputation: 15,
      levelBadge: 'Campus Explorer 🌱',
      stats: {
        rating: 5.0,
        completedSwaps: 0,
        activeCircles: 0,
        responseRate: '100%',
        reviewsCount: 0
      },
      teaching: [],
      learning: [],
      availability: 'Both', // 'Online', 'Offline', 'Both'
      preferredTimes: [],
      badges: ['New Explorer 🌱'],
      profileCompletion: 20
    };
  });

  // Persist currentUser changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skillswap_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  }, [currentUser]);

  // Student directory for 1-to-1 matching and profiles (Fresh empty state / synced from localStorage)
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // Swap requests (Inbox) - Initialized empty / from localStorage (no fake default templates)
  const [receivedRequests, setReceivedRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_received_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [sentRequests, setSentRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_sent_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Triangle Circle data (Clean empty null state / synced with localStorage)
  const [activeCircle, setActiveCircle] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_active_circle');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // 1-to-1 Chat messages (Clean empty state / synced from localStorage)
  const [directChatMessages, setDirectChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_direct_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // General Sessions list (Clean empty state / synced from localStorage)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Notifications (Clean empty state / synced from localStorage)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Persist collections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skillswap_received_requests', JSON.stringify(receivedRequests));
    } catch (e) {}
  }, [receivedRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_sent_requests', JSON.stringify(sentRequests));
    } catch (e) {}
  }, [sentRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_sessions', JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_direct_chat', JSON.stringify(directChatMessages));
    } catch (e) {}
  }, [directChatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_active_circle', JSON.stringify(activeCircle));
    } catch (e) {}
  }, [activeCircle]);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Helper actions
  const sendDirectMessage = (text, attachment = null) => {
    if (!text.trim() && !attachment) return;
    const newMsg = {
      id: 'm-' + Date.now(),
      sender: 'me',
      text,
      time: 'Just now',
      attachment
    };
    setDirectChatMessages(prev => [...prev, newMsg]);

    // Simulated responsive peer reply after 1.2s
    setTimeout(() => {
      const peerName = currentUser.name ? currentUser.name.split(' ')[0] : 'friend';
      setDirectChatMessages(prev => [
        ...prev,
        {
          id: 'm-reply-' + Date.now(),
          sender: 'peer',
          text: `Sounds great ${peerName}! Looking forward to locking this in 🚀`,
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  const sendCircleMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: 'cm-' + Date.now(),
      senderId: currentUser.id || 'curr-user',
      senderName: currentUser.name || 'You',
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      text,
      time: 'Just now'
    };
    setActiveCircle(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg]
    }));
  };

  const acceptRequest = (requestId) => {
    setReceivedRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r)
    );
    addToast('Swap request accepted! Start chatting now.', 'success');
  };

  const rejectRequest = (requestId) => {
    setReceivedRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
    );
    addToast('Request declined.', 'info');
  };

  const sendSwapRequest = ({ student, teachSkill, learnSkill, message }) => {
    const newSent = {
      id: 'req-sent-' + Date.now(),
      receiver: {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        college: student.college
      },
      teachSkill: teachSkill || currentUser.teaching?.[0] || 'Skill',
      learnSkill: learnSkill || student.canTeach[0],
      message: message || `Hey ${student.name}! I would love to connect and exchange skills with you!`,
      time: 'Just now',
      status: 'pending'
    };
    setSentRequests(prev => [newSent, ...prev]);
    addToast(`Swap request sent to ${student.name} ⚡`, 'success');
  };

  const scheduleNewSession = (sessionData) => {
    const newSession = {
      id: 'sess-' + Date.now(),
      skill: sessionData.topic || 'Skill Exchange',
      teacher: {
        name: currentUser.name || 'You',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
      },
      learner: {
        name: sessionData.partnerName || 'Peer Swapper',
        avatar: sessionData.partnerAvatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80'
      },
      date: `${sessionData.date || 'Tomorrow'}, ${sessionData.time || '6:00 PM'}`,
      duration: sessionData.duration || '60 min',
      mode: sessionData.mode || 'Online',
      status: 'Upcoming',
      sessionIndex: 1,
      totalSessions: 2,
      link: sessionData.link || 'https://meet.google.com/skw-swap-session',
      location: sessionData.location
    };
    setSessions(prev => [newSession, ...prev]);
    addToast('Session locked in 🔒 See you at the scheduled time!', 'success');
  };

  const markCircleSessionComplete = (sessionId) => {
    setActiveCircle(prev => {
      const updated = prev.sessions.map(s =>
        s.id === sessionId ? { ...s, status: 'Completed' } : s
      );
      const allDone = updated.every(s => s.status === 'Completed');
      if (allDone) {
        setTimeout(() => {
          setActiveModal('circle-celebration');
        }, 400);
      }
      return { ...prev, sessions: updated };
    });
    addToast('Circle session completed! 🎉', 'success');
  };

  const markSessionComplete = (sessionId) => {
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, status: 'Completed' } : s)
    );
    setActiveModal('rate-review');
    setModalPayload({
      teacherName: 'Anuj Verma',
      skill: 'SQL Query Tuning'
    });
  };

  const submitReview = (reviewData) => {
    addToast('Review sent 💜 Thanks for helping the community grow!', 'success');
    setActiveModal(null);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Complete Database & Local State Reset (Fresh start with 0 data)
  const resetEntireDatabaseAndState = async () => {
    try {
      const keys = [
        'skillswap_current_user',
        'skillswap_students',
        'skillswap_received_requests',
        'skillswap_sent_requests',
        'skillswap_sessions',
        'skillswap_notifications',
        'skillswap_active_circle',
        'skillswap_direct_chat'
      ];
      keys.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      setCurrentUser({
        id: 'user-' + Date.now(),
        name: '',
        handle: '',
        email: '',
        college: '',
        branch: '',
        bio: '',
        avatar: '',
        photoSource: null,
        reputation: 10,
        levelBadge: 'Campus Explorer 🌱',
        stats: {
          rating: 5.0,
          completedSwaps: 0,
          activeCircles: 0,
          responseRate: '100%',
          reviewsCount: 0
        },
        teaching: [],
        learning: [],
        availability: 'Both',
        preferredTimes: [],
        badges: ['New Explorer 🌱'],
        profileCompletion: 10
      });

      setStudents([]);
      setReceivedRequests([]);
      setSentRequests([]);
      setSessions([]);
      setNotifications([]);
      setDirectChatMessages([]);
      setActiveCircle(null);

      // Call backend reset API
      try {
        await fetch(`${BASE_URL}/reset-database`, { method: 'POST' });
      } catch (e) {
        // Safe if backend is offline
      }

      addToast('All database & app data cleared! Starting completely fresh 🚀', 'success');
    } catch (err) {
      console.error('Error during data wipe', err);
      addToast('Error resetting data', 'error');
    }
  };

  return (
    <SkillSwapContext.Provider
      value={{
        deviceView,
        setDeviceView,
        activeModal,
        setActiveModal,
        modalPayload,
        setModalPayload,
        currentUser,
        setCurrentUser,
        students,
        receivedRequests,
        sentRequests,
        activeCircle,
        setActiveCircle,
        directChatMessages,
        sendDirectMessage,
        sendCircleMessage,
        sessions,
        scheduleNewSession,
        markSessionComplete,
        markCircleSessionComplete,
        notifications,
        markAllNotificationsRead,
        acceptRequest,
        rejectRequest,
        sendSwapRequest,
        submitReview,
        toasts,
        addToast,
        resetEntireDatabaseAndState
      }}
    >
      {children}
    </SkillSwapContext.Provider>
  );
};

export const useSkillSwap = () => {
  const context = useContext(SkillSwapContext);
  if (!context) {
    throw new Error('useSkillSwap must be used within a SkillSwapProvider');
  }
  return context;
};
