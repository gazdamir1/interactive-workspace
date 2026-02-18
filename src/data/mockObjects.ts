import type { WorkspaceObject } from '../types';

export const mockObjects: WorkspaceObject[] = [
  { id: '1', name: 'Объект 1', x: 20, y: 30, status: 'active' },
  { id: '2', name: 'Объект 2', x: 50, y: 60, status: 'inactive' },
  { id: '3', name: 'Объект 3', x: 80, y: 20, status: 'disabled' },
  { id: '4', name: 'Объект 4', x: 30, y: 80, status: 'active' },
  { id: '5', name: 'Объект 5', x: 70, y: 50, status: 'inactive' },
];