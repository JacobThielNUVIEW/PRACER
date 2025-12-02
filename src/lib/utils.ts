import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPaceRange(isPremium: boolean, basePace: number) {
  const deviation = isPremium ? 0.02 : 0.10 // ±2% premium, ±10% free
  return {
    min: basePace * (1 - deviation),
    max: basePace * (1 + deviation),
  }
}
