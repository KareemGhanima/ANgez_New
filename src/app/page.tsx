import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`glass-panel ${styles.hero}`}>
        <h1 className="title">Welcome to Angez</h1>
        <p>Level up your real life.</p>
      </div>
    </main>
  );
}
