export type ObjectStatus = "active" | "inactive" | "disabled"

export interface WorkspaceObject {
  id: string
  name: string
  x: number // позиция в процентах (0-100)
  y: number
  status: ObjectStatus
}

export interface Store {
  objects: WorkspaceObject[]
  selectObject: (id: string | null) => void // выделение/снятие (меняет статус)
  updateObjectStatus: (id: string, newStatus: ObjectStatus) => void
  updateObjectPosition: (id: string, x: number, y: number) => void
  resetObjects: () => void
  randomizePositions: () => void
}
