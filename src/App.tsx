import { useEffect } from "react"
import { Workspace } from "./components/Workspace/Workspace"
import { InfoPanel } from "./components/InfoPanel/InfoPanel"
import { useStore } from "./store/useStore"
import { saveObjectsToStorage } from "./utils/storage"
import styles from "./App.module.scss"

function App() {
  const objects = useStore((state) => state.objects)
  const resetObjects = useStore((state) => state.resetObjects)

  // Сохраняем объекты в localStorage при каждом изменении
  useEffect(() => {
    saveObjectsToStorage(objects)
  }, [objects])

  return (
    <div className={styles.app}>
      <h1>Интерактивная рабочая область</h1>
      <button className={styles.resetButton} onClick={resetObjects}>
        Сбросить
      </button>
      <Workspace />
      <InfoPanel />
    </div>
  )
}

export default App
