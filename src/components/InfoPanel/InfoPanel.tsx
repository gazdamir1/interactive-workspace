import React from "react"
import { useStore } from "../../store/useStore"
import { Button } from "../UI/Button/Button"
import type { ObjectStatus } from "../../types"
import styles from "./InfoPanel.module.scss"

export const InfoPanel: React.FC = () => {
  const { objects, selectObject, updateObjectStatus } = useStore()
  const activeObject = objects.find((obj) => obj.status === "active")

  const handleClose = () => {
    selectObject(null)
  }

  const handleToggleBlock = () => {
    if (!activeObject) return

    let newStatus: ObjectStatus
    if (activeObject.status === "disabled") {
      newStatus = "inactive"
    } else {
      newStatus = "disabled"
    }

    updateObjectStatus(activeObject.id, newStatus)
  }

  return (
    <div className={`${styles.panel} ${activeObject ? styles.visible : ""}`}>
      <h3>Информация об объекте</h3>
      <p>Название: {activeObject?.name}</p>
      <p>Статус: {activeObject?.status}</p>
      <Button onClick={handleToggleBlock}>
        {activeObject?.status === "disabled"
          ? "Разблокировать"
          : "Заблокировать"}
      </Button>
      <Button onClick={handleClose}>Закрыть</Button>
    </div>
  )
}
