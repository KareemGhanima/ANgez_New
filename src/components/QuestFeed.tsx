"use client";
import React from 'react';
import { useUser } from '../context/UserContext';
import styles from './QuestFeed.module.css';
import { Check, X, Clock, ThumbsUp } from 'lucide-react';

export function QuestFeed() {
  const { quests, completeQuest, skipQuest, laterQuest, interestedQuest } = useUser();

  const pendingQuests = quests.filter(q => q.state === 'pending' || q.state === 'later');

  return (
    <div className={styles.feedContainer}>
      <h2 className="title">Daily Quests</h2>
      <div className={styles.questList}>
        {pendingQuests.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>No more quests for today. Great job!</div>
        ) : (
          pendingQuests.map(quest => (
            <div key={quest.id} className={`glass-panel ${styles.questCard}`}>
              <div className={styles.questHeader}>
                <span className={`${styles.difficultyBadge} ${styles[quest.difficulty]}`}>{quest.difficulty}</span>
                <span className={styles.xpReward}>+{quest.xpReward} XP</span>
              </div>
              <h3 className={styles.questTitle}>{quest.title}</h3>
              <div className={styles.questFooter}>
                <span className={styles.categoryBadge}>{quest.category} {quest.state === 'later' && '(Saved for Later)'}</span>
                <div className={styles.actions}>
                  <button onClick={() => interestedQuest(quest.id)} className={styles.actionBtn} aria-label="Interested" title="More like this"><ThumbsUp size={18} /></button>
                  <button onClick={() => laterQuest(quest.id)} className={styles.actionBtn} aria-label="Later" title="Save for later"><Clock size={18} /></button>
                  <button onClick={() => skipQuest(quest.id)} className={styles.actionBtn} aria-label="Skip" title="Skip quest"><X size={18} /></button>
                  <button onClick={() => completeQuest(quest.id)} className={`${styles.actionBtn} ${styles.completeBtn}`} aria-label="Complete" title="Complete quest"><Check size={18} /> Complete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
