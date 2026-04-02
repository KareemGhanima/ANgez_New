"use client";
import React from "react";
import { useUser } from "../context/UserContext";
import { calculateProgress } from "../core/levels";
import styles from "./UserStatus.module.css";

export function UserStatus() {
  const { user } = useUser();
  const xpProgress = calculateProgress(user.xp);

  return (
    <div className={`glass-panel ${styles.statusContainer}`}>
      <div className={styles.header}>
        <div className={styles.levelBadge}>
          <span className={styles.lvlText}>LVL</span>
          <strong className={styles.lvlNumber}>{user.level}</strong>
        </div>
        <div className={styles.streakIndicator}>🔥 {user.streak} Day Streak</div>
      </div>
      
      <div className={styles.xpSection}>
        <div className={styles.xpBarContainer}>
          <div className={styles.xpBar} style={{ width: `${xpProgress}%` }}></div>
        </div>
        <div className={styles.xpTextWrapper}>
          <span>{user.xp} XP</span>
          <span>{xpProgress.toFixed(0)}%</span>
        </div>
      </div>

      <div className={styles.attributesGrid}>
        {Object.entries(user.attributes).map(([attr, val]) => (
          <div key={attr} className={styles.attrBox}>
            <span className={styles.attrName}>{attr}</span>
            <span className={styles.attrVal}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
