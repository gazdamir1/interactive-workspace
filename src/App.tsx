import { Workspace } from "./components/Workspace/Workspace"
import { InfoPanel } from "./components/InfoPanel/InfoPanel"
import styles from "./App.module.scss"

const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
document.documentElement.style.setProperty(
  "--scrollbar-width",
  scrollbarWidth + "px",
)

function App() {
  return (
    <div className={styles.app}>
      <h1>Интерактивная рабочая область</h1>
      <Workspace />
      <InfoPanel />
    </div>
  )
}

export default App
