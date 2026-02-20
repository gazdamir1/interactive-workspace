import { create } from "zustand"
import type { Store } from "../types"
import { mockObjects } from "../data/mockObjects"
import { loadObjectsFromStorage } from "../utils/storage"

const initialObjects = loadObjectsFromStorage() || mockObjects

export const useStore = create<Store>((set) => ({
  objects: initialObjects,

  resetObjects: () => set({ objects: mockObjects }),

  selectObject: (id) =>
    set((state) => {
      if (id === null) {
        return {
          objects: state.objects.map((obj) =>
            obj.status === "active" ? { ...obj, status: "inactive" } : obj,
          ),
        }
      }
      const target = state.objects.find((obj) => obj.id === id)
      if (!target) return state
      if (target.status === "disabled") return state
      if (target.status === "active") {
        return {
          objects: state.objects.map((obj) =>
            obj.id === id ? { ...obj, status: "inactive" } : obj,
          ),
        }
      }
      return {
        objects: state.objects.map((obj) => {
          if (obj.status === "active") {
            return { ...obj, status: "inactive" }
          }
          if (obj.id === id) {
            return { ...obj, status: "active" }
          }
          return obj
        }),
      }
    }),

  updateObjectStatus: (id, newStatus) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, status: newStatus } : obj,
      ),
    })),

  updateObjectPosition: (id, x, y) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, x, y } : obj,
      ),
    })),

  randomizePositions: () =>
    set((state) => ({
      objects: state.objects.map((obj) => ({
        ...obj,
        x: Math.random() * 100,
        y: Math.random() * 100,
      })),
    })),
}))
