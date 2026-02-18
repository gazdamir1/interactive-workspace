import { createContext } from "react"
import type { RefObject } from "react"

interface WorkspaceContextType {
  workspaceRef: RefObject<HTMLDivElement | null>
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null)
