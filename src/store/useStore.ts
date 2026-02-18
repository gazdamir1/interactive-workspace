import { create } from "zustand"
import type { Store } from "../types"
import { mockObjects } from "../data/mockObjects"

export const useStore = create<Store>((set) => ({
  objects: mockObjects,
  selectedId: null,
  selectObject: (id) => set({ selectedId: id }),
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
}))
