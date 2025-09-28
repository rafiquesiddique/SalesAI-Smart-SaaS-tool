// src/components/ui/badge.jsx
import React from "react";
export const Badge = ({ children, className = "", variant, ...props }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded ${className}`} {...props}>{children}</span>
);
