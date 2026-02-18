import React, { useState, useContext } from "react"
import styles from "./ObjectItem.module.scss"
import type { WorkspaceObject } from "../../types"
import { useStore } from "../../store/useStore"
import { WorkspaceContext } from "../../context/WorkspaceContext"

interface ObjectItemProps {
  object: WorkspaceObject
  isSelected: boolean
  onClick: () => void
}

export const ObjectItem: React.FC<ObjectItemProps> = ({
  object,
  isSelected,
  onClick,
}) => {
  const updateObjectPosition = useStore((state) => state.updateObjectPosition)
  const [isDragging, setIsDragging] = useState(false)
  const workspaceContext = useContext(WorkspaceContext)

  console.log(
    "ObjectItem render:",
    object.id,
    workspaceContext?.workspaceRef.current,
  ) // Отладка

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("Mouse down on object:", object.id) // Отладка

    e.stopPropagation()
    e.preventDefault()

    if (object.status === "disabled") {
      console.log("Object is disabled, no drag")
      return
    }

    const workspaceElement = workspaceContext?.workspaceRef.current
    console.log("Workspace element:", workspaceElement) // Отладка

    if (!workspaceElement) {
      console.log("No workspace element found")
      return
    }

    const startX = e.clientX
    const startY = e.clientY
    const initialX = object.x
    const initialY = object.y
    const rect = workspaceElement.getBoundingClientRect()

    console.log("Start drag:", { startX, startY, initialX, initialY, rect })

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault()

      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100

      const newX = Math.min(100, Math.max(0, initialX + deltaX))
      const newY = Math.min(100, Math.max(0, initialY + deltaY))

      console.log("Moving:", { newX, newY }) // Отладка

      updateObjectPosition(object.id, newX, newY)
      setIsDragging(true)
    }

    const onMouseUp = () => {
      console.log("Mouse up, isDragging:", isDragging) // Отладка
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      setTimeout(() => setIsDragging(false), 0)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const handleClick = () => {
    console.log("Click, isDragging:", isDragging) // Отладка
    if (!isDragging) {
      onClick()
    }
  }

  const itemClasses = [
    styles.object,
    styles[`status-${object.status}`],
    isSelected ? styles.selected : "",
  ].join(" ")

  return (
    <div
      className={itemClasses}
      style={{
        left: `${object.x}%`,
        top: `${object.y}%`,
        position: "absolute",
        cursor: object.status === "disabled" ? "default" : "move",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span>{object.name}</span>
    </div>
  )
}
