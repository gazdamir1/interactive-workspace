import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"
import { useStore } from "./store/useStore"
import { mockObjects } from "./data/mockObjects"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("./store/useStore", () => ({
  useStore: vi.fn(),
}))

const mockUseStore = vi.mocked(useStore)

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders title and workspace", () => {
    const mockStore = {
      objects: mockObjects,
      resetObjects: vi.fn(),
      randomizePositions: vi.fn(),
      selectObject: vi.fn(),
      updateObjectStatus: vi.fn(),
      updateObjectPosition: vi.fn(),
    }
    mockUseStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockStore)
      }
      return mockStore
    })
    render(<App />)
    expect(
      screen.getByText("Интерактивная рабочая область"),
    ).toBeInTheDocument()
    expect(screen.getByText("Объект 1")).toBeInTheDocument()
  })

  it("calls resetObjects when reset button clicked", async () => {
    const resetObjects = vi.fn()
    const mockStore = {
      objects: mockObjects,
      resetObjects,
      randomizePositions: vi.fn(),
      selectObject: vi.fn(),
      updateObjectStatus: vi.fn(),
      updateObjectPosition: vi.fn(),
    }
    mockUseStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockStore)
      }
      return mockStore
    })
    render(<App />)
    const resetButton = screen.getByText("Сбросить")
    await userEvent.click(resetButton)
    expect(resetObjects).toHaveBeenCalledTimes(1)
  })

  it("sets up interval for randomizePositions", () => {
    vi.useFakeTimers()
    const randomizePositions = vi.fn()
    const mockStore = {
      objects: mockObjects,
      resetObjects: vi.fn(),
      randomizePositions,
      selectObject: vi.fn(),
      updateObjectStatus: vi.fn(),
      updateObjectPosition: vi.fn(),
    }
    mockUseStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockStore)
      }
      return mockStore
    })
    render(<App />)
    vi.advanceTimersByTime(10000)
    expect(randomizePositions).toHaveBeenCalledTimes(1)
  })
})
