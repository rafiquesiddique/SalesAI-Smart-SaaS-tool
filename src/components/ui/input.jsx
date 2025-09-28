// src/components/ui/input.jsx
import React from "react";
export const Input = ({ className = "", ...props }) => (
  <input className={`border rounded px-3 py-2 ${className}`} {...props} />
);
