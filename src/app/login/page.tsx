"use client";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock network request before navigating to dashboard
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <form className={`glass-panel ${styles.form}`} onSubmit={handleLogin}>
        <h2 className="title">Login to Angez</h2>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="player@angez.com" required />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "Authenticating..." : "Enter the Game"}
        </button>
      </form>
    </div>
  );
}
