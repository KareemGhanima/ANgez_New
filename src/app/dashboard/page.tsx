"use client";
import React from 'react';
import { UserStatus } from '../../components/UserStatus';
import { AvatarViewer } from '../../components/AvatarViewer';
import { QuestFeed } from '../../components/QuestFeed';
import { ThemeSettings } from '../../components/ThemeSettings';
import styles from './dashboard.module.css';

export default function Dashboard() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className="title">Angez System</h1>
        <ThemeSettings />
      </header>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <AvatarViewer />
          <UserStatus />
        </div>
        <div className={styles.rightColumn}>
          <QuestFeed />
        </div>
      </div>
    </main>
  );
}
