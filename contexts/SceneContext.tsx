"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SceneContextType {
  unlockedScenes: Set<number>
  unlockScene: (sceneNumber: number) => void
  isSceneUnlocked: (sceneNumber: number) => boolean
}

const SceneContext = createContext<SceneContextType | undefined>(undefined)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [unlockedScenes, setUnlockedScenes] = useState<Set<number>>(new Set([1]))

  const unlockScene = (sceneNumber: number) => {
    setUnlockedScenes(prev => new Set([...prev, sceneNumber]))
  }

  const isSceneUnlocked = (sceneNumber: number) => {
    return unlockedScenes.has(sceneNumber)
  }

  return (
    <SceneContext.Provider value={{ unlockedScenes, unlockScene, isSceneUnlocked }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useSceneContext() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error("useSceneContext must be used within SceneProvider")
  }
  return context
}
