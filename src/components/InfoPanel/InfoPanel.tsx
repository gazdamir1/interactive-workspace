import React from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../UI/Button/Button';
import styles from './InfoPanel.module.scss';

export const InfoPanel: React.FC = () => {
  const { selectedId, objects, updateObjectStatus, selectObject } = useStore();
  const selectedObject = objects.find(obj => obj.id === selectedId);

  if (!selectedObject) return null; // панель скрыта, если нет выделенного объекта

  const handleClose = () => {
    selectObject(null);
  };

  const toggleStatus = () => {
    // Циклически меняем статус: active -> inactive -> disabled -> active
    const statusCycle: Record<string, 'active' | 'inactive' | 'disabled'> = {
      active: 'inactive',
      inactive: 'disabled',
      disabled: 'active',
    };
    const newStatus = statusCycle[selectedObject.status];
    updateObjectStatus(selectedObject.id, newStatus);
  };

  return (
    <div className={styles.panel}>
      <h3>Информация об объекте</h3>
      <p>Название: {selectedObject.name}</p>
      <p>Статус: {selectedObject.status}</p>
      <Button onClick={toggleStatus}>Изменить статус</Button>
      <Button onClick={handleClose}>Закрыть</Button>
    </div>
  );
};