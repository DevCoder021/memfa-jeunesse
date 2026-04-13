"use client"

import { usePathname } from "next/navigation"

type PageTransitionProps = {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <div key={pathname} className={`apple-route-enter ${className}`}>
      {children}
    </div>
  )
}
