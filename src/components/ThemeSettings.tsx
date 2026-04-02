"use client";
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeSettings.module.css';
import { Settings } from 'lucide-react';

export function ThemeSettings() {
  const { theme, updateTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.gearBtn} onClick={() => setOpen(!open)} aria-label="Customize Theme">
        <Settings size={28} />
      </button>

      {open && (
        <div className={`glass-panel ${styles.dropdown}`}>
          <h4>Theme Customizer</h4>
          
          <div className={styles.settingGroup}>
            <label>Primary Focus</label>
            <input type="color" value={theme.primary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTheme({ primary: e.target.value })} title="Primary color" />
          </div>

          <div className={styles.settingGroup}>
            <label>Action Accent</label>
            <input type="color" value={theme.accent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTheme({ accent: e.target.value })} title="Accent color" />
          </div>
          
          <div className={styles.settingGroup}>
            <label>Interface BG</label>
            <input type="color" value={theme.bgColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTheme({ bgColor: e.target.value })} title="Background color" />
          </div>

          <div className={styles.presets}>
            <button onClick={() => updateTheme({ primary: '#8b5cf6', accent: '#10b981', bgColor: '#0f172a' })}>Cyber</button>
            <button onClick={() => updateTheme({ primary: '#e11d48', accent: '#f59e0b', bgColor: '#18181b' })}>Inferno</button>
            <button onClick={() => updateTheme({ primary: '#3b82f6', accent: '#14b8a6', bgColor: '#001a2c' })}>Abyss</button>
          </div>
        </div>
      )}
    </div>
  );
}
