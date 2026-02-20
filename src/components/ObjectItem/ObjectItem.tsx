import React, { useState, useContext } from "react"
import styles from "./ObjectItem.module.scss"
import type { WorkspaceObject } from "../../types"
import { useStore } from "../../store/useStore"
import { WorkspaceContext } from "../../context/WorkspaceContext"

interface ObjectItemProps {
  object: WorkspaceObject
  onClick: () => void
}

export const ObjectItem: React.FC<ObjectItemProps> = ({ object, onClick }) => {
  const updateObjectPosition = useStore((state) => state.updateObjectPosition)
  const [isDragging, setIsDragging] = useState(false)
  const workspaceContext = useContext(WorkspaceContext)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (object.status === "disabled") return

    const workspaceElement = workspaceContext?.workspaceRef.current
    if (!workspaceElement) return

    const startX = e.clientX
    const startY = e.clientY
    const initialX = object.x
    const initialY = object.y
    const rect = workspaceElement.getBoundingClientRect()

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault()

      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100

      const newX = Math.min(100, Math.max(0, initialX + deltaX))
      const newY = Math.min(100, Math.max(0, initialY + deltaY))

      updateObjectPosition(object.id, newX, newY)
      setIsDragging(true)
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      setTimeout(() => setIsDragging(false), 0)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()

    if (object.status === "disabled") return

    const workspaceElement = workspaceContext?.workspaceRef.current
    if (!workspaceElement) return

    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY
    const initialX = object.x
    const initialY = object.y
    const rect = workspaceElement.getBoundingClientRect()

    const onTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault()
      const touchMove = moveEvent.touches[0]
      const deltaX = ((touchMove.clientX - startX) / rect.width) * 100
      const deltaY = ((touchMove.clientY - startY) / rect.height) * 100
      const newX = Math.min(100, Math.max(0, initialX + deltaX))
      const newY = Math.min(100, Math.max(0, initialY + deltaY))
      updateObjectPosition(object.id, newX, newY)
      setIsDragging(true)
    }

    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
      setTimeout(() => setIsDragging(false), 0)
    }

    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd)
  }

  const handleClick = () => {
    if (!isDragging && object.status !== "disabled") {
      onClick()
    }
  }

  const itemClasses = [
    styles.object,
    styles[`status-${object.status}`],
    object.status === "active" ? styles.selected : "",
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
      onTouchStart={handleTouchStart}
      data-testid="object-item"
    >
      <span>{object.name}</span>
    </div>
  )
}
