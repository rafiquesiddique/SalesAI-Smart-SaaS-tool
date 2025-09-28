// // src/lib/utils.js
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function createPageUrl(page) {
//   return `/${page.toLowerCase()}`;
// }

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// src/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function createPageUrl(page) {
  return `/${page.toLowerCase()}`;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}