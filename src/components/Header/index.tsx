import Link from 'next/link'
import styles from './header.module.scss'
export default function Header() {
  return (
    <header className={styles.container}>
      <main>
        <Link href="/">
          <img src="/logo.svg" alt="logo" />
        </Link>
      </main>
    </header>
  )
}
