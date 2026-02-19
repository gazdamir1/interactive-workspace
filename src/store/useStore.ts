import { create } from "zustand"
import type { Store } from "../types"
import { mockObjects } from "../data/mockObjects"

export const useStore = create<Store>((set) => ({
  objects: mockObjects,

  selectObject: (id) =>
    set((state) => {
      // Снять выделение (id === null или клик на тот же объект)
      if (id === null) {
        return {
          objects: state.objects.map((obj) =>
            obj.status === "active" ? { ...obj, status: "inactive" } : obj,
          ),
        }
      }

      const target = state.objects.find((obj) => obj.id === id)
      if (!target) return state

      // Игнорируем клик по disabled
      if (target.status === "disabled") return state

      // Если кликнули на активный – снимаем выделение
      if (target.status === "active") {
        return {
          objects: state.objects.map((obj) =>
            obj.id === id ? { ...obj, status: "inactive" } : obj,
          ),
        }
      }

      // Иначе (клик на inactive) – делаем его активным, предыдущий активный сбрасываем
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
}))
