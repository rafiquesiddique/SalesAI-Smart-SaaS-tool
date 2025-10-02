import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(page) {
  // This helper is typically for relative navigation within the app
  // For example, if 'page' is 'Dashboard', it returns '/dashboard'
  return `/${page.toLowerCase()}`;
}