import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={130}
          height={130}
        />
        <span>My Website</span>
      </Link>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;