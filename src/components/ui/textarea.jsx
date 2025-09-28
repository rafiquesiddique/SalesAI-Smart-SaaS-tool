// src/components/ui/textarea.jsx
import React from "react";
export const Textarea = ({ className = "", ...props }) => (
  <textarea className={`border rounded px-3 py-2 ${className}`} {...props} />
);