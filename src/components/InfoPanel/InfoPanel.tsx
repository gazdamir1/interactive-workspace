import React, { useEffect, useState } from "react"
import { useStore } from "../../store/useStore"
import { Button } from "../UI/Button/Button"
import type { ObjectStatus } from "../../types"
import styles from "./InfoPanel.module.scss"

export const InfoPanel: React.FC = () => {
  const { objects, selectObject, updateObjectStatus } = useStore()
  const activeObject = objects.find((obj) => obj.status === "active")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (activeObject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [activeObject])

  const handleClose = () => {
    selectObject(null) // active -> inactive (панель закрывается)
  }

  const handleToggleBlock = () => {
    if (!activeObject) return

    let newStatus: ObjectStatus
    if (activeObject.status === "disabled") {
      newStatus = "inactive" // разблокировка
    } else {
      // active или inactive -> disabled (блокировка)
      newStatus = "disabled"
    }

    updateObjectStatus(activeObject.id, newStatus)
    // После изменения статуса объект перестаёт быть active, панель закроется автоматически
  }

  if (!isVisible) return null

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
