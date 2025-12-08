import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <Image
            className={styles.logo}
            src="/cityalert.png"
            alt="City Alerts logo"
            width={180}
            height={180}
            priority
          />
          
          <h1 className={styles.title}>City Alerts</h1>
          
          <p className={styles.description}>
            Signalez les problèmes de votre ville et contribuez à son amélioration.
            Une plateforme simple et efficace pour les citoyens engagés.
          </p>
          
          <Link href="/login" className={styles.loginButton}>
            Se connecter
          </Link>
        </div>
      </main>
    </div>
  );
}