import React, { useRef, useEffect } from "react"
import { useStore } from "../../store/useStore"
import { ObjectItem } from "../ObjectItem/ObjectItem"
import { WorkspaceContext } from "../../context/WorkspaceContext"
import styles from "./Workspace.module.scss"

export const Workspace: React.FC = () => {
  const { objects, selectedId, selectObject } = useStore()
  const workspaceRef = useRef<HTMLDivElement>(null)

  // Отладка: проверяем, когда ref получает значение
  useEffect(() => {
    console.log("Workspace ref current:", workspaceRef.current)
  }, [])

  const handleObjectClick = (id: string) => {
    selectObject(selectedId === id ? null : id)
  }

  return (
    <WorkspaceContext.Provider value={{ workspaceRef }}>
      <div
        ref={workspaceRef}
        className={styles.workspace}
        style={{ position: "relative" }} // убедимся, что позиционирование работает
      >
        {objects.map((obj) => (
          <ObjectItem
            key={obj.id}
            object={obj}
            isSelected={selectedId === obj.id}
            onClick={() => handleObjectClick(obj.id)}
          />
        ))}
      </div>
    </WorkspaceContext.Provider>
  )
}
