import React, { useRef, useState } from 'react';
import styles from './ObjectItem.module.scss';
import type { WorkspaceObject } from '../../types';
import { useStore } from '../../store/useStore';

interface ObjectItemProps {
  object: WorkspaceObject;
  isSelected: boolean;
  onClick: () => void;
}

export const ObjectItem: React.FC<ObjectItemProps> = ({
  object,
  isSelected,
  onClick,
}) => {
  const updateObjectPosition = useStore((state) => state.updateObjectPosition);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (object.status === 'disabled') return; // disabled нельзя перемещать

    const workspaceElement = document.querySelector('.workspace') as HTMLElement;
    if (!workspaceElement) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = object.x;
    const initialY = object.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      if (!workspaceElement) return;

      const deltaX = (moveEvent.clientX - startX) / workspaceElement.offsetWidth * 100;
      const deltaY = (moveEvent.clientY - startY) / workspaceElement.offsetHeight * 100;

      const newX = Math.min(100, Math.max(0, initialX + deltaX));
      const newY = Math.min(100, Math.max(0, initialY + deltaY));

      updateObjectPosition(object.id, newX, newY);
      setIsDragging(true);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setTimeout(() => setIsDragging(false), 0);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleClick = () => {
    if (!isDragging) {
      onClick();
    }
  };

  const itemClasses = [
    styles.object,
    styles[`status-${object.status}`],
    isSelected ? styles.selected : '',
  ].join(' ');

  return (
    <div
      className={itemClasses}
      style={{ left: `${object.x}%`, top: `${object.y}%` }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span>{object.name}</span>
    </div>
  );
};