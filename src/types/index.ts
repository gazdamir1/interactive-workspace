export type ObjectStatus = 'active' | 'inactive' | 'disabled';

export interface WorkspaceObject {
  id: string;
  name: string;
  x: number;
  y: number;
  status: ObjectStatus;
}

export interface Store {
  objects: WorkspaceObject[];
  selectedId: string | null;
  selectObject: (id: string | null) => void;
  updateObjectStatus: (id: string, newStatus: ObjectStatus) => void;
  updateObjectPosition: (id: string, x: number, y: number) => void;
}