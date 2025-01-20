import styles from './app.module.css'
import Maze from './Maze.jsx'

export default function App() {
  return (
    <div className={styles.app}>
      <Maze />
    </div>
  )
}