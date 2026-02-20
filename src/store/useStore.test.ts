import { describe, it, expect, beforeEach } from "vitest"
import { useStore } from "./useStore"
import { mockObjects } from "../data/mockObjects"

describe("useStore", () => {
  beforeEach(() => {
    // Сброс стора к начальному состоянию перед каждым тестом
    useStore.setState({
      objects: mockObjects,
    })
  })

  it("should initialize with mock objects", () => {
    const { objects } = useStore.getState()
    expect(objects).toEqual(mockObjects)
  })

  it("should select an inactive object and make it active", () => {
    const { selectObject } = useStore.getState()
    selectObject("1")
    const { objects } = useStore.getState()
    const activeObj = objects.find((obj) => obj.id === "1")
    expect(activeObj?.status).toBe("active")
    // Проверяем, что другие не стали активными
    const otherActive = objects.filter(
      (obj) => obj.status === "active" && obj.id !== "1",
    )
    expect(otherActive).toHaveLength(0)
  })

  it("should deselect active object on click again", () => {
    const { selectObject } = useStore.getState()
    selectObject("1") // активируем
    selectObject("1") // деактивируем
    const { objects } = useStore.getState()
    const obj = objects.find((o) => o.id === "1")
    expect(obj?.status).toBe("inactive")
  })

  it("should not select disabled object", () => {
    const { selectObject } = useStore.getState()
    selectObject("3") // объект с id 3 - disabled
    const { objects } = useStore.getState()
    const obj = objects.find((o) => o.id === "3")
    expect(obj?.status).toBe("disabled") // статус не изменился
    // Никто не активен
    expect(objects.some((o) => o.status === "active")).toBe(false)
  })

  it("should update object status", () => {
    const { updateObjectStatus } = useStore.getState()
    updateObjectStatus("1", "disabled")
    const { objects } = useStore.getState()
    expect(objects.find((o) => o.id === "1")?.status).toBe("disabled")
  })

  it("should update object position", () => {
    const { updateObjectPosition } = useStore.getState()
    updateObjectPosition("1", 10, 20)
    const { objects } = useStore.getState()
    expect(objects.find((o) => o.id === "1")).toMatchObject({ x: 10, y: 20 })
  })

  it("should reset objects to mock", () => {
    const { resetObjects, updateObjectPosition } = useStore.getState()
    updateObjectPosition("1", 99, 99) // меняем позицию
    resetObjects()
    const { objects } = useStore.getState()
    expect(objects).toEqual(mockObjects)
  })

  it("should randomize positions", () => {
    const { randomizePositions } = useStore.getState()
    const before = useStore.getState().objects.map((o) => ({ x: o.x, y: o.y }))
    randomizePositions()
    const after = useStore.getState().objects.map((o) => ({ x: o.x, y: o.y }))
    // Проверяем, что хотя бы одна позиция изменилась (с учётом случайности может не измениться, но вероятность мала)
    expect(before).not.toEqual(after)
  })
})
