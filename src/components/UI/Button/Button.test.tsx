import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./Button"
import { describe, it, expect, vi } from "vitest"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByText("Click"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("applies className and other props", () => {
    render(
      <Button className="test-class" disabled>
        Disabled
      </Button>,
    )
    const button = screen.getByText("Disabled")
    expect(button).toHaveClass("test-class")
    expect(button).toBeDisabled()
  })
})
