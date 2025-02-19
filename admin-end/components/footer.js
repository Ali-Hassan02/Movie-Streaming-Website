import styles from '../styles/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerLinks}>
        <a href="#" className={styles.footerLink}>Help</a>
        <a href="#" className={styles.footerLink}>Conditions of Use</a>
        <a href="#" className={styles.footerLink}>Privacy Notice</a>
      </div>
      <div className={styles.footerCopyright}>
        © 1996-2024, Amazon.com, Inc. or its affiliates
      </div>
    </footer>
  );
}

export default Footer;
