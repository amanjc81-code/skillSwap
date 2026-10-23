import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Plus,Sparkles,
  Camera,
  Check,
  Search,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  CheckCircle2,
  Video,
  MapPin,
  Laptop,
  Upload,
  AlertCircle,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { firebaseLoginWithGoogle, formatFirebaseError } from '../../lib/firebase.js';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, addToast } = useSkillSwap();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Actual User State (Zero hardcoded fake defaults)
  const [name, setName] = useState(currentUser.name || '');
  const [college, setCollege] = useState(currentUser.college || '');
  const [branch, setBranch] = useState(currentUser.branch || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [photoSource, setPhotoSource] = useState(currentUser.photoSource || (currentUser.avatar ? 'saved' : null));
  const [photoError, setPhotoError] = useState('');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [isFetchingGoogle, setIsFetchingGoogle] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [teachSkills, setTeachSkills] = useState(currentUser.teaching?.length ? currentUser.teaching : []);
  const [learnSkills, setLearnSkills] = useState(currentUser.learning?.length ? currentUser.learning : []);
  const [teachSearch, setTeachSearch] = useState('');
  const [learnSearch, setLearnSearch] = useState('');
  const [customSkillsList, setCustomSkillsList] = useState([]);

  const handleAddCustomTeachSkill = (overrideSkill) => {
    const skillToAdd = (typeof overrideSkill === 'string' ? overrideSkill : teachSearch).trim();
    if (!skillToAdd) return;

    const alreadySelected = teachSkills.some(s => s.toLowerCase() === skillToAdd.toLowerCase());
    if (alreadySelected) {
      addToast(`"${skillToAdd}" is already in your teaching list!`, 'info');
      setTeachSearch('');
      return;
    }

    setTeachSkills(prev => [...prev, skillToAdd]);
    if (!customSkillsList.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      setCustomSkillsList(prev => [...prev, skillToAdd]);
    }
    addToast(`Added "${skillToAdd}" to Skills You Can Teach! 🚀`, 'success');
    setTeachSearch('');
  };

  const handleAddCustomLearnSkill = (overrideSkill) => {
    const skillToAdd = (typeof overrideSkill === 'string' ? overrideSkill : learnSearch).trim();
    if (!skillToAdd) return;

    const alreadySelected = learnSkills.some(s => s.toLowerCase() === skillToAdd.toLowerCase());
    if (alreadySelected) {
      addToast(`"${skillToAdd}" is already in your learning goals!`, 'info');
      setLearnSearch('');
      return;
    }

    setLearnSkills(prev => [...prev, skillToAdd]);
    if (!customSkillsList.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      setCustomSkillsList(prev => [...prev, skillToAdd]);
    }
    addToast(`Added "${skillToAdd}" to Skills You Want to Learn! 🎯`, 'success');
    setLearnSearch('');
  };

  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [availability, setAvailability] = useState(currentUser.availability || 'Both');
  const [preferredSlots, setPreferredSlots] = useState(currentUser.preferredTimes?.length ? currentUser.preferredTimes : []);

  const allSkillsList = [
    'React', 'Full Stack', 'SQL', 'PostgreSQL', 'Python', 'FastAPI', 'Pandas',
    'C++', 'DSA & Algorithms', 'UI/UX Design', 'Figma', 'Video Editing',
    'Premiere Pro', 'Canva', 'Public Speaking', 'System Design', 'Docker',
    'Linux/Bash', 'Machine Learning', 'Next.js', 'TypeScript', 'Tailwind CSS'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload an image file (JPEG, PNG, WEBP, GIF).');
      addToast('Invalid file format. Please upload an image.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      addToast('File too large (max 5MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatar(dataUrl);
      setPhotoSource('upload');
      setAvatarFileName(file.name);
      setPhotoError('');
      addToast(`Photo uploaded from device (${file.name})! 📸`, 'success');
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image file. Please try again.');
      addToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFetchGooglePhoto = async () => {
    setIsFetchingGoogle(true);
    setPhotoError('');
    try {
      const cred = await firebaseLoginWithGoogle();
      const fbUser = cred.user;
      if (fbUser?.photoURL) {
        setAvatar(fbUser.photoURL);
        setPhotoSource('gmail');
        setAvatarFileName(fbUser.email || 'Google Account Photo');
        setPhotoError('');
        if (!name) {
          if (fbUser.displayName) setName(fbUser.displayName);
        }
        addToast(`Fetched Gmail profile photo from ${fbUser.email}! 📸`, 'success');
      } else {
        setPhotoError('Signed in with Google, but no profile photo found on this Gmail account. Please upload your photo from device below.');
        addToast('No photo found on this Google account. Please upload from device.', 'info');
      }
    } catch (err) {
      const msg = formatFirebaseError(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setPhotoError(msg);
        addToast(msg, 'error');
      }
    } finally {
      setIsFetchingGoogle(false);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    setPhotoSource(null);
    setAvatarFileName('');
    setPhotoError('⚠️ Photo upload is COMPULSORY! Please upload a photo or fetch from Google.');
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Photo removed. Upload is compulsory to continue.', 'info');
  };

  const toggleSkill = (skill, list, setList) => {
    if (list.includes(skill)) {
      setList(list.filter(s => s !== skill));
    } else {
      setList([...list, skill]);
    }
  };

  const toggleSlot = (slot) => {
    setPreferredSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        addToast('Please enter your display name to continue.', 'error');
        return;
      }
    }

    if (step === 2) {
      if (!avatar || !avatar.trim()) {
        setPhotoError('⚠️ Photo upload is COMPULSORY! You must upload a photo from your device or fetch from Google/Gmail to continue.');
        addToast('Photo upload is compulsory to complete your profile!', 'error');
        return;
      }
      setPhotoError('');
    }

    if (step === 3) {
      if (teachSkills.length === 0) {
        addToast('Please select at least 1 skill you can teach.', 'info');
      }
    }

    if (step === 4) {
      if (learnSkills.length === 0) {
        addToast('Please select at least 1 skill you want to learn.', 'info');
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finalize and save actual user data
      const updatedUser = {
        ...currentUser,
        name: name.trim() || 'Campus Student',
        college: college.trim() || 'Campus University',
        branch: branch.trim() || 'Student',
        bio: bio.trim(),
        avatar: avatar,
        photoSource: photoSource,
        teaching: teachSkills,
        learning: learnSkills,
        availability,
        preferredTimes: preferredSlots,
        profileCompletion: 100
      };
      setCurrentUser(updatedUser);
      addToast('Profile passport complete! Welcome to SkillSwap 🔥', 'success');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>
        {/* Top Zine Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <div style={{
            background: '#FEF08A',
            border: '2px solid #27272A',
            borderRadius: '6px',
            padding: '6px 20px',
            transform: 'rotate(-1deg)',
            boxShadow: '3px 4px 0px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <span style={{ fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', letterSpacing: '0.04em' }}>
              CAMPUS STUDENT ONBOARDING PASSPORT • 7 STEPS TO SWAP
            </span>
          </div>
        </div>

        {/* Notebook Sheet */}
        <div className="notebook-sheet" style={{
          padding: '42px 38px 46px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '680px',
          position: 'relative'
        }}>
          {/* Chrome Binder Clip at Top */}
          <div className="binder-clip-top" />

          {/* Top Ruler Progress Bar */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                  STEP {step} OF {totalSteps}
                </span>
                <span style={{ fontSize: '0.95rem', color: '#18181B', fontFamily: 'var(--font-titan)', letterSpacing: '0.02em' }}>
                  {step === 1 && 'Basic Persona'}
                  {step === 2 && 'Student Photo (Compulsory)'}
                  {step === 3 && 'Skills You Can Teach'}
                  {step === 4 && 'Skills You Want to Learn'}
                  {step === 5 && 'Experience Level'}
                  {step === 6 && 'Availability & Mode'}
                  {step === 7 && 'Ready to Swap!'}
                </span>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#008744', fontFamily: 'var(--font-titan)' }}>
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>

            {/* Segmented Yellow Ruler Bar */}
            <div style={{ width: '100%', height: '10px', background: '#E4E4E7', borderRadius: '999px', border: '1.5px solid #27272A', overflow: 'hidden' }}>
              <div style={{
                width: `${(step / totalSteps) * 100}%`,
                height: '100%',
                background: '#008744',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>

          {/* STEP CONTENTS */}
          <div style={{ flex: 1 }}>
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div>
                <span className="sticker-badge sticker-badge-edu" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                  STEP 1 • PROFILE ESSENTIALS
                </span>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', margin: '4px 0 6px 0' }}>
                  TELL US ABOUT YOURSELF
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, margin: '0 0 24px 0' }}>
                  This helps your campus peers discover you for mutual study sessions ✍️
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                      DISPLAY NAME *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="scrapbook-input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                      COLLEGE / UNIVERSITY *
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. BITS Pilani / IIT Delhi / Campus Tech Hub"
                      className="scrapbook-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                      BRANCH & YEAR
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      placeholder="e.g. Computer Science, 3rd Year"
                      className="scrapbook-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                      SHORT BIO (PUNCHY & HONEST)
                    </label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      placeholder="e.g. Passionate about web development, looking to master SQL indexing and Python algorithms!"
                      className="scrapbook-input"
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Photo Upload (Compulsory + Gmail Auto-Fetch) */}
            {step === 2 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-titan)',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    boxShadow: '0 3px 0 #991B1B',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <AlertCircle size={14} /> COMPULSORY STEP *
                  </span>
                  <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                    STUDENT VERIFICATION
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', margin: '4px 0 6px 0' }}>
                  UPLOAD YOUR PROFILE PHOTO
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, maxWidth: '580px', margin: '0 auto 24px auto', lineHeight: 1.3 }}>
                  Fetch directly from Google / Gmail, ya apna genuine student photo upload karo. Profile ke liye <strong>photo upload compulsory hai</strong> ✍️
                </p>

                {/* Error Banner if user tried to continue without photo */}
                {photoError && (
                  <div style={{
                    background: '#FEE2E2',
                    border: '2px solid #DC2626',
                    borderRadius: '10px',
                    padding: '12px 18px',
                    marginBottom: '20px',
                    color: '#991B1B',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.1)'
                  }}>
                    <AlertCircle size={22} color="#DC2626" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#991B1B' }}>Photo Required:</strong> {photoError}
                    </div>
                  </div>
                )}

                {/* Hidden Real File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {/* PHOTO PREVIEW & DROPZONE */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  {avatar ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      {/* Polaroid Frame */}
                      <div className="polaroid-card" style={{
                        padding: '10px 10px 24px 10px',
                        width: '180px',
                        background: '#FFFFFF',
                        border: '2px solid #27272A',
                        boxShadow: '4px 6px 14px rgba(0, 0, 0, 0.25)',
                        transform: 'rotate(-2deg)'
                      }}>
                        <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '44%' }} />

                        <div style={{ width: '100%', height: '170px', borderRadius: '3px', overflow: 'hidden', background: '#F4F4F5' }}>
                          <img
                            src={avatar}
                            alt="Profile avatar preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{
                          marginTop: '8px',
                          fontFamily: 'var(--font-hand)',
                          fontSize: '1.15rem',
                          color: '#007A3D',
                          fontWeight: 800,
                          textAlign: 'center'
                        }}>
                          {photoSource === 'gmail' ? '✓ Google Photo 🌐' : (photoSource === 'upload' ? '✓ Uploaded 📸' : '✓ Verified ⚡')}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        title="Remove Photo"
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #27272A',
                          boxShadow: '1px 2px 4px rgba(0,0,0,0.3)',
                          cursor: 'pointer',
                          zIndex: 35
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : (
                    /* Empty Upload Dropzone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileUpload({ target: { files: [file] } });
                      }}
                      style={{
                        width: '100%',
                        maxWidth: '420px',
                        padding: '32px 20px',
                        borderRadius: '12px',
                        border: isDragOver ? '3px dashed #008744' : '3px dashed #DC2626',
                        background: isDragOver ? '#DCFCE7' : '#FEF2F2',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: '3px 4px 0px rgba(0,0,0,0.08)'
                      }}
                    >
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                        border: '2px solid #DC2626'
                      }}>
                        <Camera size={30} />
                      </div>
                      <div style={{ fontWeight: 800, color: '#18181B', fontSize: '1.05rem', fontFamily: 'var(--font-titan)', marginBottom: '4px' }}>
                        CLICK OR DRAG & DROP PHOTO HERE
                      </div>
                      <div style={{ color: '#B91C1C', fontSize: '0.85rem', fontWeight: 700 }}>
                        ⚠️ Photo upload is COMPULSORY (PNG, JPG, WEBP &lt; 5MB)
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Status Pill */}
                <div style={{ marginBottom: '24px' }}>
                  {avatar ? (
                    <span className="ripped-tag ripped-green" style={{ fontSize: '0.82rem', padding: '4px 16px' }}>
                      <CheckCircle2 size={15} style={{ marginRight: '6px' }} /> Photo Selected: {avatarFileName || (photoSource === 'gmail' ? 'Google Account Photo' : 'Custom Upload')}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.82rem',
                      color: '#991B1B',
                      fontWeight: 700,
                      background: '#FEE2E2',
                      padding: '5px 16px',
                      borderRadius: '999px',
                      border: '1.5px solid #DC2626'
                    }}>
                      No photo selected yet • Choose an option below
                    </span>
                  )}
                </div>

                {/* PRIMARY ACTION BUTTONS */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '14px',
                  flexWrap: 'wrap',
                  marginBottom: '28px'
                }}>
                  {/* Option 1: Google / Gmail Auto-Fetch */}
                  <button
                    type="button"
                    onClick={handleFetchGooglePhoto}
                    disabled={isFetchingGoogle}
                    className="btn-3d-yellow"
                    style={{ padding: '12px 22px', fontSize: '0.85rem' }}
                  >
                    {isFetchingGoogle ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> FETCHING GMAIL PHOTO...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                        </svg>
                        FETCH FROM GOOGLE / GMAIL
                      </>
                    )}
                  </button>

                  {/* Option 2: Real Device File Upload */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-3d-green"
                    style={{ padding: '12px 24px', fontSize: '0.85rem' }}
                  >
                    <Upload size={16} /> UPLOAD FROM DEVICE (FILE)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Skills I Can Teach */}
            {step === 3 && (
              <div>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                  STEP 3 • YOUR SUPERPOWERS
                </span>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', margin: '4px 0 6px 0' }}>
                  SKILLS I CAN TEACH
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, margin: '0 0 20px 0' }}>
                  Select at least 1 or 2 skills you feel comfortable guiding fellow students in ✍️
                </p>

                {/* Search & Custom Add Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
                    <input
                      type="text"
                      value={teachSearch}
                      onChange={e => setTeachSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTeachSkill();
                        }
                      }}
                      placeholder="Type any skill (e.g. dataStructure in c++, React, Python)..."
                      className="scrapbook-input"
                      style={{ paddingLeft: '40px', width: '100%', height: '46px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCustomTeachSkill()}
                    disabled={!teachSearch.trim()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0 20px',
                      height: '46px',
                      borderRadius: '8px',
                      border: '2px solid #18181B',
                      background: teachSearch.trim() ? '#008744' : '#E4E4E7',
                      color: teachSearch.trim() ? '#FFFFFF' : '#A1A1AA',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '0.88rem',
                      cursor: teachSearch.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: teachSearch.trim() ? '0 3px 0 #005a2d' : 'none',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap'
                    }}
                    title="Click or press Enter to add skill"
                  >
                    <Plus size={18} strokeWidth={3} />
                    <span>+ ADD</span>
                  </button>
                </div>

                {/* Quick Add Custom Skill banner */}
                {teachSearch.trim() && !teachSkills.some(s => s.toLowerCase() === teachSearch.trim().toLowerCase()) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#ECFDF5',
                    border: '2px dashed #059669',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.86rem', color: '#065F46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✨ Add custom skill:</span>
                      <strong style={{ color: '#047857' }}>"{teachSearch.trim()}"</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCustomTeachSkill()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-titan)',
                        background: '#008744',
                        color: '#FFFFFF',
                        border: '2px solid #005a2d',
                        boxShadow: '0 2px 0 #005a2d',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={15} strokeWidth={3} /> ADD "{teachSearch.trim().toUpperCase()}"
                    </button>
                  </div>
                )}

                {/* Selected Chips */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-titan)', color: '#18181B', marginBottom: '8px' }}>
                    SELECTED TO TEACH ({teachSkills.length})
                  </div>
                  {teachSkills.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: '#71717A', fontStyle: 'italic' }}>
                      No skills selected yet. Click any skill below to add!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {teachSkills.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s, teachSkills, setTeachSkills)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-titan)',
                            background: '#008744',
                            color: '#FFFFFF',
                            border: '2px solid #005a2d',
                            boxShadow: '0 3px 0 #005a2d',
                            cursor: 'pointer'
                          }}
                        >
                          ✓ {s.toUpperCase()} ✕
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Chips */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-titan)', color: '#71717A', marginBottom: '8px' }}>
                    POPULAR CAMPUS SKILLS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {Array.from(new Set([...allSkillsList, ...customSkillsList]))
                      .filter(s => s.toLowerCase().includes(teachSearch.toLowerCase()) && !teachSkills.includes(s))
                      .map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s, teachSkills, setTeachSkills)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-titan)',
                            background: '#FFFFFF',
                            color: '#18181B',
                            border: '2px solid #27272A',
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          + {s.toUpperCase()}
                        </button>
                      ))}
                    {Array.from(new Set([...allSkillsList, ...customSkillsList]))
                      .filter(s => s.toLowerCase().includes(teachSearch.toLowerCase()) && !teachSkills.includes(s)).length === 0 && teachSearch.trim() && (
                      <div style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        border: '1px dashed #D1D5DB',
                        fontSize: '0.85rem',
                        color: '#4B5563',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <span>"{teachSearch.trim()}" is not in popular skills. You can still add it!</span>
                        <button
                          type="button"
                          onClick={() => handleAddCustomTeachSkill()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            background: '#008744',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-titan)',
                            fontSize: '0.8rem',
                            border: '1px solid #005a2d',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={14} /> + ADD AS SKILL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Skills I Want to Learn */}
            {step === 4 && (
              <div>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                  STEP 4 • YOUR TARGET QUESTS
                </span>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', margin: '4px 0 6px 0' }}>
                  SKILLS I WANT TO LEARN
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, margin: '0 0 20px 0' }}>
                  What do you need help with right now? Our campus engine matches you with peer mentors ✍️
                </p>

                {/* Search & Custom Add Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
                    <input
                      type="text"
                      value={learnSearch}
                      onChange={e => setLearnSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomLearnSkill();
                        }
                      }}
                      placeholder="Type any skill you want to learn (e.g. dataStructure in c++, Python, System Design)..."
                      className="scrapbook-input"
                      style={{ paddingLeft: '40px', width: '100%', height: '46px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCustomLearnSkill()}
                    disabled={!learnSearch.trim()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0 20px',
                      height: '46px',
                      borderRadius: '8px',
                      border: '2px solid #18181B',
                      background: learnSearch.trim() ? '#0284C7' : '#E4E4E7',
                      color: learnSearch.trim() ? '#FFFFFF' : '#A1A1AA',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '0.88rem',
                      cursor: learnSearch.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: learnSearch.trim() ? '0 3px 0 #075985' : 'none',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap'
                    }}
                    title="Click or press Enter to add target skill"
                  >
                    <Plus size={18} strokeWidth={3} />
                    <span>+ ADD</span>
                  </button>
                </div>

                {/* Quick Add Custom Skill banner */}
                {learnSearch.trim() && !learnSkills.some(s => s.toLowerCase() === learnSearch.trim().toLowerCase()) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#F0F9FF',
                    border: '2px dashed #0284C7',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.86rem', color: '#0369A1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✨ Add custom quest:</span>
                      <strong style={{ color: '#0284C7' }}>"{learnSearch.trim()}"</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCustomLearnSkill()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-titan)',
                        background: '#0284C7',
                        color: '#FFFFFF',
                        border: '2px solid #075985',
                        boxShadow: '0 2px 0 #075985',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={15} strokeWidth={3} /> ADD "{learnSearch.trim().toUpperCase()}"
                    </button>
                  </div>
                )}

                {/* Selected Chips */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-titan)', color: '#18181B', marginBottom: '8px' }}>
                    SELECTED TO LEARN ({learnSkills.length})
                  </div>
                  {learnSkills.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: '#71717A', fontStyle: 'italic' }}>
                      No skills selected yet. Click any skill below to add!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {learnSkills.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s, learnSkills, setLearnSkills)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-titan)',
                            background: '#0284C7',
                            color: '#FFFFFF',
                            border: '2px solid #075985',
                            boxShadow: '0 3px 0 #075985',
                            cursor: 'pointer'
                          }}
                        >
                          ✓ {s.toUpperCase()} ✕
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Chips */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-titan)', color: '#71717A', marginBottom: '8px' }}>
                    TRENDING SKILLS TO LEARN
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {Array.from(new Set([...allSkillsList, ...customSkillsList]))
                      .filter(s => s.toLowerCase().includes(learnSearch.toLowerCase()) && !learnSkills.includes(s))
                      .map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s, learnSkills, setLearnSkills)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-titan)',
                            background: '#FFFFFF',
                            color: '#18181B',
                            border: '2px solid #27272A',
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          + {s.toUpperCase()}
                        </button>
                      ))}
                    {Array.from(new Set([...allSkillsList, ...customSkillsList]))
                      .filter(s => s.toLowerCase().includes(learnSearch.toLowerCase()) && !learnSkills.includes(s)).length === 0 && learnSearch.trim() && (
                      <div style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        border: '1px dashed #D1D5DB',
                        fontSize: '0.85rem',
                        color: '#4B5563',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <span>"{learnSearch.trim()}" is not in popular skills. You can still add it!</span>
                        <button
                          type="button"
                          onClick={() => handleAddCustomLearnSkill()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            background: '#0284C7',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-titan)',
                            fontSize: '0.8rem',
                            border: '1px solid #075985',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={14} /> + ADD AS SKILL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Skill Level */}
            {step === 5 && (
              <div>
                <span className="sticker-badge sticker-badge-edu" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                  STEP 5 • CALIBRATION
                </span>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', margin: '4px 0 6px 0' }}>
                  WHAT IS YOUR OVERALL LEVEL?
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, margin: '0 0 24px 0' }}>
                  Helps calibrate expectations so you find peer partners at the right speed ✍️
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                  {[
                    { title: 'Beginner', desc: 'Starting from scratch, grasping fundamentals & core concepts.', icon: '🌱' },
                    { title: 'Intermediate', desc: 'Can build working projects, seeking optimizations & deep dives.', icon: '⚡' },
                    { title: 'Advanced', desc: 'High proficiency, looking for architectural patterns & advanced edge-cases.', icon: '🔥' }
                  ].map(lvl => (
                    <div
                      key={lvl.title}
                      onClick={() => setSkillLevel(lvl.title)}
                      className="scrapbook-paper-card"
                      style={{
                        padding: '18px 22px',
                        cursor: 'pointer',
                        background: skillLevel === lvl.title ? '#FEF9C3' : '#FFFFFF',
                        border: skillLevel === lvl.title ? '2.5px solid #CA8A04' : '2px solid #27272A',
                        boxShadow: skillLevel === lvl.title ? '4px 4px 0px #CA8A04' : '2px 2px 0px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '2rem' }}>{lvl.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-titan)', fontSize: '1.15rem', color: '#18181B' }}>{lvl.title.toUpperCase()}</div>
                        <div style={{ color: '#4B5563', fontSize: '0.88rem', fontWeight: 600, marginTop: '2px' }}>{lvl.desc}</div>
                      </div>
                      {skillLevel === lvl.title && <CheckCircle2 size={24} color="#008744" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: Availability & Preferred Mode */}
            {step === 6 && (
              <div>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                  STEP 6 • LOGISTICS
                </span>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', margin: '4px 0 6px 0' }}>
                  AVAILABILITY & MODE
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, margin: '0 0 24px 0' }}>
                  How and when do you prefer to swap knowledge with campus peers? ✍️
                </p>

                {/* Mode selection */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '10px' }}>
                    PREFERRED MODE
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { id: 'Online', label: 'Online Only', icon: Video },
                      { id: 'Offline', label: 'Campus In-Person', icon: MapPin },
                      { id: 'Both', label: 'Both / Flexible', icon: Laptop }
                    ].map(m => {
                      const Icon = m.icon;
                      const isSelected = availability === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setAvailability(m.id)}
                          style={{
                            padding: '16px 8px',
                            textAlign: 'center',
                            borderRadius: '10px',
                            background: isSelected ? '#FEF9C3' : '#FFFFFF',
                            border: isSelected ? '2.5px solid #CA8A04' : '2px solid #27272A',
                            boxShadow: isSelected ? '0 4px 0 #CA8A04' : '2px 2px 0px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          <Icon size={22} color={isSelected ? '#047857' : '#71717A'} style={{ marginBottom: '6px' }} />
                          <div style={{ fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B' }}>
                            {m.label.toUpperCase()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '10px' }}>
                    PREFERRED TIME SLOTS
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Mornings (9-12 AM)', 'Afternoons (2-5 PM)', 'Evenings (6-9 PM)', 'Late Nights (9-11 PM)', 'Weekends'].map(slot => {
                      const isSel = preferredSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-titan)',
                            background: isSel ? '#008744' : '#FFFFFF',
                            color: isSel ? '#FFFFFF' : '#18181B',
                            border: '2px solid #27272A',
                            boxShadow: isSel ? '0 3px 0 #005a2d' : '2px 2px 0px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          {isSel ? '✓ ' : '+ '}{slot.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Confirmation Passport */}
            {step === 7 && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#008744',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 5px 0 #005a2d',
                  marginBottom: '16px'
                }}>
                  <Flame size={44} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.75rem', padding: '3px 14px' }}>
                    LEVEL 1 VERIFIED SWAPPER ⚡
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.3rem', color: '#18181B', margin: '4px 0 8px 0' }}>
                  YOU’RE READY TO SWAP 🔥
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.3 }}>
                  Your student passport is stamped! We’re ready to match you with campus peers without money ✍️
                </p>

                {/* Learning Pass Card */}
                <div className="scrapbook-paper-card" style={{ padding: '22px 24px', textAlign: 'left', marginBottom: '16px', border: '2px solid #27272A' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-titan)', color: '#78350F', marginBottom: '12px' }}>
                    YOUR CAMPUS LEARNING PASS
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {avatar && (
                        <img src={avatar} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #27272A' }} />
                      )}
                      <div>
                        <div style={{ fontFamily: 'var(--font-titan)', fontSize: '1.15rem', color: '#18181B' }}>{name || 'Campus Student'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>{college || 'Campus'} • {branch || 'Student'}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: '#007A3D', fontWeight: 800 }}>
                        TEACHING: {teachSkills.length ? teachSkills.slice(0, 3).join(', ') : 'Add skills in dashboard'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#0284C7', fontWeight: 800 }}>
                        LEARNING: {learnSkills.length ? learnSkills.slice(0, 3).join(', ') : 'Add skills in dashboard'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom CTAs */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '2px dashed #C4B98E'
          }}>
            {step > 1 && step < 7 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-3d-yellow"
                style={{ padding: '10px 22px', fontSize: '0.85rem' }}
              >
                <ArrowLeft size={16} /> BACK
              </button>
            ) : <div />}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              {step === 2 && (!avatar || !avatar.trim()) && (
                <span style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 800 }}>
                  ⚠️ Photo upload compulsory to continue
                </span>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="btn-3d-green"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.92rem'
                }}
              >
                {step === 7 ? 'ENTER DASHBOARD 🔥' : (
                  <>CONTINUE <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
