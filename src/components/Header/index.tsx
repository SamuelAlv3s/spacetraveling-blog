import styles from './header.module.scss'
export default function Header() {
  return (
    <header className={styles.container}>
      <main>
        <img src="/logo.svg" alt="spacetraveling logo" />
      </main>
    </header>
  )
}
