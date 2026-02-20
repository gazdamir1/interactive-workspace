import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ObjectItem } from "./ObjectItem"
import { WorkspaceContext } from "../../context/WorkspaceContext"
import { useStore } from "../../store/useStore"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("../../store/useStore", () => ({
  useStore: vi.fn(),
}))

const mockUseStore = vi.mocked(useStore)

const createMockStore = (overrides = {}) => ({
  objects: [],
  selectObject: vi.fn(),
  updateObjectStatus: vi.fn(),
  updateObjectPosition: vi.fn(),
  resetObjects: vi.fn(),
  randomizePositions: vi.fn(),
  ...overrides,
})

const mockObject = {
  id: "1",
  name: "Test Object",
  x: 50,
  y: 50,
  status: "inactive" as const,
}

const mockWorkspaceRef = { current: document.createElement("div") }

Object.defineProperty(mockWorkspaceRef.current, "getBoundingClientRect", {
  value: () => ({
    width: 1000,
    height: 800,
    top: 0,
    left: 0,
    bottom: 800,
    right: 1000,
  }),
})

describe("ObjectItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders object name", () => {
    const mockStore = createMockStore()
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem object={mockObject} onClick={() => {}} />
      </WorkspaceContext.Provider>,
    )
    expect(screen.getByTestId("object-item")).toBeInTheDocument()
    expect(screen.getByText("Test Object")).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const mockStore = createMockStore()
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    const handleClick = vi.fn()
    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem object={mockObject} onClick={handleClick} />
      </WorkspaceContext.Provider>,
    )
    await userEvent.click(screen.getByTestId("object-item"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("calls updateObjectPosition on mouse drag", async () => {
    const updateObjectPosition = vi.fn()
    const mockStore = createMockStore({ updateObjectPosition })
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    const user = userEvent.setup()

    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem object={mockObject} onClick={() => {}} />
      </WorkspaceContext.Provider>,
    )

    const element = screen.getByTestId("object-item")

    await user.pointer({ keys: "[MouseLeft>]", target: element })
    await user.pointer({ coords: { x: 600, y: 500 } })
    await user.pointer({ keys: "[/MouseLeft]" })

    expect(updateObjectPosition).toHaveBeenCalledTimes(1)
    expect(updateObjectPosition).toHaveBeenCalledWith(
      "1",
      expect.any(Number),
      expect.any(Number),
    )
  })

  it("does not call onClick while dragging", async () => {
    const mockStore = createMockStore()
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem object={mockObject} onClick={handleClick} />
      </WorkspaceContext.Provider>,
    )

    const element = screen.getByTestId("object-item")

    await user.pointer({ keys: "[MouseLeft>]", target: element })
    await user.pointer({ coords: { x: 600, y: 500 } })
    await user.pointer({ keys: "[/MouseLeft]" })

    expect(handleClick).not.toHaveBeenCalled()
  })

  it("does not start drag if object is disabled", async () => {
    const updateObjectPosition = vi.fn()
    const mockStore = createMockStore({ updateObjectPosition })
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    const user = userEvent.setup()

    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem
          object={{ ...mockObject, status: "disabled" }}
          onClick={() => {}}
        />
      </WorkspaceContext.Provider>,
    )

    const element = screen.getByTestId("object-item")

    await user.pointer({ keys: "[MouseLeft>]", target: element })
    await user.pointer({ coords: { x: 600, y: 500 } })
    await user.pointer({ keys: "[/MouseLeft]" })

    expect(updateObjectPosition).not.toHaveBeenCalled()
  })

  it("does not call onClick if object is disabled", async () => {
    const mockStore = createMockStore()
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    const handleClick = vi.fn()

    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem
          object={{ ...mockObject, status: "disabled" }}
          onClick={handleClick}
        />
      </WorkspaceContext.Provider>,
    )

    await userEvent.click(screen.getByTestId("object-item"))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("resets dragging flag after mouse up", async () => {
    const mockStore = createMockStore()
    mockUseStore.mockImplementation((selector) => selector(mockStore))
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <WorkspaceContext.Provider value={{ workspaceRef: mockWorkspaceRef }}>
        <ObjectItem object={mockObject} onClick={handleClick} />
      </WorkspaceContext.Provider>,
    )

    const element = screen.getByTestId("object-item")

    await user.pointer({ keys: "[MouseLeft>]", target: element })
    await user.pointer({ coords: { x: 600, y: 500 } })
    await user.pointer({ keys: "[/MouseLeft]" })
    await new Promise((r) => setTimeout(r, 10))
    await user.click(element)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
