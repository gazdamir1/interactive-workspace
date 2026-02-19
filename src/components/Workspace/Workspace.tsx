import React, { useRef } from "react"
import { useStore } from "../../store/useStore"
import { ObjectItem } from "../ObjectItem/ObjectItem"
import { WorkspaceContext } from "../../context/WorkspaceContext"
import styles from "./Workspace.module.scss"

export const Workspace: React.FC = () => {
  const { objects, selectObject } = useStore()
  const workspaceRef = useRef<HTMLDivElement>(null)

  const handleObjectClick = (id: string) => {
    selectObject(id)
  }

  return (
    <WorkspaceContext.Provider value={{ workspaceRef }}>
      <div ref={workspaceRef} className={styles.workspace}>
        {objects.map((obj) => (
          <ObjectItem
            key={obj.id}
            object={obj}
            onClick={() => handleObjectClick(obj.id)}
          />
        ))}
      </div>
    </WorkspaceContext.Provider>
  )
}
