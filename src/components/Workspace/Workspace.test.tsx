import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Workspace } from "./Workspace"
import { useStore } from "../../store/useStore"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockObjects } from "../../data/mockObjects"
import type { Store } from "../../types"

vi.mock("../../store/useStore", () => ({
  useStore: vi.fn(),
}))

const mockUseStore = vi.mocked(useStore)

describe("Workspace", () => {
  beforeEach(() => {
    const mockStore = {
      objects: mockObjects,
      selectObject: vi.fn(),
    } as unknown as Store
    mockUseStore.mockReturnValue(mockStore)
  })

  it("renders all objects", () => {
    render(<Workspace />)
    mockObjects.forEach((obj) => {
      expect(screen.getByText(obj.name)).toBeInTheDocument()
    })
  })

  it("calls selectObject when an object is clicked", async () => {
    const selectObject = vi.fn()
    mockUseStore.mockReturnValue({
      objects: mockObjects,
      selectObject,
    } as unknown as Store)
    render(<Workspace />)
    await userEvent.click(screen.getByText("Объект 1"))
    expect(selectObject).toHaveBeenCalledWith("1")
  })
})
