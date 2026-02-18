import React from 'react';
import { useStore } from '../../store/useStore';
import { ObjectItem } from '../ObjectItem/ObjectItem';
import styles from './Workspace.module.scss';

export const Workspace: React.FC = () => {
  const { objects, selectedId, selectObject } = useStore();

  const handleObjectClick = (id: string) => {
    // Больше не проверяем на disabled — любой объект может быть выбран
    selectObject(selectedId === id ? null : id);
  };

  return (
    <div className={styles.workspace}>
      {objects.map((obj) => (
        <ObjectItem
          key={obj.id}
          object={obj}
          isSelected={selectedId === obj.id}
          onClick={() => handleObjectClick(obj.id)}
        />
      ))}
    </div>
  );
};