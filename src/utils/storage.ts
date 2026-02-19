import type { WorkspaceObject } from "../types"

const STORAGE_KEY = "workspace-objects"

export const loadObjectsFromStorage = (): WorkspaceObject[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as WorkspaceObject[]
    }
  } catch (error) {
    console.error("Failed to load objects from localStorage:", error)
  }
  return null
}

export const saveObjectsToStorage = (objects: WorkspaceObject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects))
  } catch (error) {
    console.error("Failed to save objects to localStorage:", error)
  }
}
