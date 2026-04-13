"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type InteractiveCardProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function InteractiveCard({ children, className, delay = 0 }: InteractiveCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const transition = useMemo(
    () => (isPressed ? "transform 120ms ease-out, box-shadow 220ms ease-out, opacity 320ms ease-out" : "transform 320ms ease-out, box-shadow 320ms ease-out, opacity 420ms ease-out"),
    [isPressed]
  )

  return (
    <div
      className={cn(
        "will-change-transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className
      )}
      style={{ transform, transition }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const rotateX = -((y / rect.height) - 0.5) * 6
        const rotateY = ((x / rect.width) - 0.5) * 8
        setTransform(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.01)`)
      }}
      onMouseLeave={() => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)")}
      onMouseDown={() => {
        setIsPressed(true)
        setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(0.992)")
      }}
      onMouseUp={() => {
        setIsPressed(false)
        setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)")
      }}
    >
      {children}
    </div>
  )
}
