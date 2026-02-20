import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InfoPanel } from "./InfoPanel"
import { useStore } from "../../store/useStore"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { WorkspaceObject, Store } from "../../types"
import styles from "./InfoPanel.module.scss" // импорт стилей для доступа к сгенерированным классам

vi.mock("../../store/useStore", () => ({
  useStore: vi.fn(),
}))

const mockUseStore = vi.mocked(useStore)

const mockActiveObject: WorkspaceObject = {
  id: "1",
  name: "Active Object",
  x: 50,
  y: 50,
  status: "active",
}

const mockInactiveObject: WorkspaceObject = {
  id: "2",
  name: "Inactive Object",
  x: 30,
  y: 30,
  status: "inactive",
}

describe("InfoPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders with visible class when active object exists", () => {
    const mockStore = {
      objects: [mockActiveObject],
      selectObject: vi.fn(),
      updateObjectStatus: vi.fn(),
    } as unknown as Store
    mockUseStore.mockReturnValue(mockStore)
    render(<InfoPanel />)
    const panel = screen.getByText("Информация об объекте").parentElement
    // Проверяем наличие класса из CSS-модуля
    expect(panel).toHaveClass(styles.visible)
  })

  it("renders without visible class when no active object", () => {
    const mockStore = {
      objects: [mockInactiveObject],
      selectObject: vi.fn(),
      updateObjectStatus: vi.fn(),
    } as unknown as Store
    mockUseStore.mockReturnValue(mockStore)
    render(<InfoPanel />)
    const panel = screen.getByText("Информация об объекте").parentElement
    expect(panel).not.toHaveClass(styles.visible)
  })

  it("displays active object info", () => {
    const mockStore = {
      objects: [mockActiveObject],
      selectObject: vi.fn(),
      updateObjectStatus: vi.fn(),
    } as unknown as Store
    mockUseStore.mockReturnValue(mockStore)
    render(<InfoPanel />)
    // Функция-матчер для поиска текста внутри элементов
    expect(
      screen.getByText((content) => content.includes("Active Object")),
    ).toBeInTheDocument()
    expect(
      screen.getByText((content) => content.includes("active")),
    ).toBeInTheDocument()
    expect(screen.getByText("Заблокировать")).toBeInTheDocument()
  })

  it("calls updateObjectStatus with disabled when block clicked", async () => {
    const updateObjectStatus = vi.fn()
    const mockStore = {
      objects: [mockActiveObject],
      selectObject: vi.fn(),
      updateObjectStatus,
    } as unknown as Store
    mockUseStore.mockReturnValue(mockStore)
    render(<InfoPanel />)
    await userEvent.click(screen.getByText("Заблокировать"))
    expect(updateObjectStatus).toHaveBeenCalledWith("1", "disabled")
  })

  it("calls selectObject(null) when close clicked", async () => {
    const selectObject = vi.fn()
    const mockStore = {
      objects: [mockActiveObject],
      selectObject,
      updateObjectStatus: vi.fn(),
    } as unknown as Store
    mockUseStore.mockReturnValue(mockStore)
    render(<InfoPanel />)
    await userEvent.click(screen.getByText("Закрыть"))
    expect(selectObject).toHaveBeenCalledWith(null)
  })
})
