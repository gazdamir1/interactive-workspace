import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { loadObjectsFromStorage, saveObjectsToStorage } from "./storage"
import type { WorkspaceObject } from "../types"

const mockObjects: WorkspaceObject[] = [
  { id: "1", name: "Test", x: 10, y: 20, status: "inactive" },
]

describe("storage", () => {
  const originalSetItem = localStorage.setItem

  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.setItem = originalSetItem
  })

  it("should save objects to localStorage", () => {
    saveObjectsToStorage(mockObjects)
    expect(localStorage.getItem("workspace-objects")).toBe(
      JSON.stringify(mockObjects),
    )
  })

  it("should load objects from localStorage", () => {
    localStorage.setItem("workspace-objects", JSON.stringify(mockObjects))
    const loaded = loadObjectsFromStorage()
    expect(loaded).toEqual(mockObjects)
  })

  it("should return null if no data in localStorage", () => {
    const loaded = loadObjectsFromStorage()
    expect(loaded).toBeNull()
  })

  it("should handle JSON parse error", () => {
    localStorage.setItem("workspace-objects", "invalid json")
    const loaded = loadObjectsFromStorage()
    expect(loaded).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })
})
