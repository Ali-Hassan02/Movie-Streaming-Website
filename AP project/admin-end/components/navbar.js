import { useEffect, useState } from "react";
import styles from '../styles/Navbar.module.css';
import Link from "next/link";
import { useRouter } from "next/router";

const Nav = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/getToken").then(res => {
      if (!res.ok) {
        router.push('/');
      }
      return res.json(); 
    }).then(data => setUser(data.user));
  }, [router]);

  const logout = async () => {
    try {
      const response = await fetch('/api/clearToken', { method: 'POST' });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return <h1></h1>; 
  }

  return (
    <>
      <nav className={styles.navbar}>
        <li className={styles.navItem}>
          <Link href="/dashboard">
            <img src="/assets/images/imdb-logo.png" className={styles.logo} alt="IMDB Logo" />
          </Link>
        </li>
        <ul className={styles.navbarNav}>
          <li className={`${styles.navItem} ${router.pathname === "/actor" ? styles.active : ""}`}>
            <Link href="/actor" className={styles.navLink}>Actor</Link>
          </li>
          <li className={`${styles.navItem} ${router.pathname === "/director" ? styles.active : ""}`}>
            <Link href="/director" className={styles.navLink}>Director</Link>
          </li>
          <li className={`${styles.navItem} ${router.pathname === "/producer" ? styles.active : ""}`}>
            <Link href="/producer" className={styles.navLink}>Producer</Link>
          </li>
          <li className={`${styles.navItem} ${router.pathname === "/movie" ? styles.active : ""}`}>
            <Link href="/movie" className={styles.navLink}>Movie</Link>
          </li>
        </ul>
        <div className={styles.logoutContainer}>
          <button onClick={logout} className={styles.logoutLink}>Logout</button>
        </div>
      </nav>
      <h3 className={styles.welcomeHeader}>Welcome, {user.name}!</h3>
    </>
  );
};

export default Nav;
