"use client";
import React from 'react';
import { useUser } from '../context/UserContext';
import styles from './AvatarViewer.module.css';
import { User, Zap, Coffee } from 'lucide-react';

export function AvatarViewer() {
  const { user } = useUser();
  
  const getAvatarIcon = () => {
    if (user.avatarState === 'high_activity') return <Zap size={80} color="var(--primary)" />;
    if (user.avatarState === 'tired') return <Coffee size={80} color="var(--text-secondary)" />;
    return <User size={80} color="var(--accent)" />;
  };

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={`${styles.avatarCircle} ${styles[user.avatarState]}`}>
         {getAvatarIcon()}
      </div>
      <div className={styles.info}>
        <h3>{user.avatarStyle.toUpperCase()}</h3>
        <p className={styles.statusText}>Status: {user.avatarState.replace('_', ' ')}</p>
      </div>
    </div>
  );
}
