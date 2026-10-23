import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '../lib/api.js';

const SkillSwapContext = createContext(null);

// High-Fidelity Demo Student Templates for 1-to-1 Matching Presentation
export const INITIAL_DEMO_STUDENTS = [
  {
    id: 'demo-student-1',
    name: 'Rohan Mehta',
    college: 'MIT ACSC • TYBCA',
    branch: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 19,
    mode: 'Both',
    compatibility: 98,
    matchType: 'Perfect Match',
    bio: 'Backend API developer building microservices. I can teach Python, FastAPI, and Pandas data pipelines. Looking to learn Full Stack and PostgreSQL for my semester project!',
    canTeach: ['Python', 'FastAPI', 'Pandas'],
    wantsToLearn: ['Full Stack', 'PostgreSQL', 'React'],
    availability: 'Weekdays 5-8 PM & Weekends',
    reputation: 98
  },
  {
    id: 'demo-student-2',
    name: 'Ananya Deshmukh',
    college: 'COEP Tech • Computer Engg',
    branch: 'Data Science & AI',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 24,
    mode: 'Online',
    compatibility: 96,
    matchType: 'Perfect Match',
    bio: 'Data science & analytics geek. Hands-on with Python, Pandas data cleaning, and FastAPI endpoints. Need peer mentorship to learn C++ and DSA for product interview rounds!',
    canTeach: ['Python', 'FastAPI', 'Pandas', 'Machine Learning'],
    wantsToLearn: ['C++', 'DSA & Algorithms', 'PostgreSQL'],
    availability: 'Flexible • Online Only',
    reputation: 96
  },
  {
    id: 'demo-student-3',
    name: 'Vikramaditya Iyer',
    college: 'VIT Pune • Information Tech',
    branch: 'Information Technology',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 16,
    mode: 'Both',
    compatibility: 95,
    matchType: 'Perfect Match',
    bio: 'Built automated web pipelines with Python & FastAPI. Strong with Pandas dataframes. Looking to master C++ systems and Full Stack web architecture with a peer!',
    canTeach: ['Python', 'FastAPI', 'Pandas', 'SQL'],
    wantsToLearn: ['C++', 'Full Stack', 'System Design'],
    availability: 'Evenings 6-9 PM',
    reputation: 94
  },
  {
    id: 'demo-student-4',
    name: 'Priya Nair',
    college: 'PICT Pune • Computer Engg',
    branch: 'Computer Engineering',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 21,
    mode: 'Online',
    compatibility: 94,
    matchType: 'Strong Match',
    bio: 'Full Stack web developer & UI/UX designer. Love crafting interactive React apps and schema design in PostgreSQL. Want to learn Python & FastAPI backend!',
    canTeach: ['Full Stack', 'React', 'PostgreSQL', 'UI/UX Design'],
    wantsToLearn: ['Python', 'FastAPI', 'Pandas'],
    availability: 'Daily 7-10 PM',
    reputation: 93
  },
  {
    id: 'demo-student-5',
    name: 'Aditya Sharma',
    college: 'MIT ACSC • SYBCA',
    branch: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 13,
    mode: 'Both',
    compatibility: 92,
    matchType: 'Strong Match',
    bio: 'C++ competitive programmer with 400+ LeetCode problems solved. Can guide through pointers, STL & DSA. Want to learn Full Stack and FastAPI web frameworks!',
    canTeach: ['C++', 'DSA & Algorithms', 'PostgreSQL'],
    wantsToLearn: ['Full Stack', 'Python', 'FastAPI'],
    availability: 'Weekends & Offline Campus',
    reputation: 91
  },
  {
    id: 'demo-student-6',
    name: 'Sneha Kulkarni',
    college: 'Symbiosis SIT • Computer Science',
    branch: 'Data Science',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 18,
    mode: 'Online',
    compatibility: 90,
    matchType: 'Strong Match',
    bio: 'Database specialist with deep expertise in PostgreSQL indexing, SQL queries and DB normalization. Looking to learn Python, Pandas & FastAPI for ETL pipelines!',
    canTeach: ['PostgreSQL', 'SQL', 'System Design'],
    wantsToLearn: ['Python', 'Pandas', 'FastAPI'],
    availability: 'Mon, Wed, Fri 4-7 PM',
    reputation: 90
  },
  {
    id: 'demo-student-7',
    name: 'Kabir Joshi',
    college: 'DY Patil College of Engg',
    branch: 'Information Technology',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 11,
    mode: 'Both',
    compatibility: 88,
    matchType: 'Partial Match',
    bio: 'DevOps & Linux sysadmin hobbyist. Containerizing apps with Docker & CI/CD. Excited to swap knowledge with peers knowing Python or Full Stack!',
    canTeach: ['Docker', 'Linux/Bash', 'System Design'],
    wantsToLearn: ['Python', 'FastAPI', 'React'],
    availability: 'Saturday & Sunday All Day',
    reputation: 88
  },
  {
    id: 'demo-student-8',
    name: 'Tanvi Malhotra',
    college: 'MIT ACSC • TYBCA',
    branch: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 22,
    mode: 'Online',
    compatibility: 93,
    matchType: 'Perfect Match',
    bio: 'Modern frontend developer with React, Next.js & Tailwind CSS. Happy to share frontend tricks in exchange for C++ or PostgreSQL backend guidance!',
    canTeach: ['React', 'Next.js', 'Figma', 'Tailwind CSS'],
    wantsToLearn: ['PostgreSQL', 'C++', 'Python'],
    availability: 'Tue & Thu 6-9 PM',
    reputation: 95
  }
];

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

  // Student directory for 1-to-1 matching and profiles (Initialized with rich campus demo templates)
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_STUDENTS;
  });

  const resetStudentsToDemo = () => {
    setStudents(INITIAL_DEMO_STUDENTS);
    try {
      localStorage.setItem('skillswap_students', JSON.stringify(INITIAL_DEMO_STUDENTS));
    } catch (e) {
      console.error(e);
    }
    addToast('Loaded campus demo peer matches! ✨', 'success');
  };

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
        setStudents,
        resetStudentsToDemo,
        INITIAL_DEMO_STUDENTS,
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
