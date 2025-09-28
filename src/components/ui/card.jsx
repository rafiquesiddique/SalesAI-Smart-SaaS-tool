// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg border border-slate-200 ${className}`} {...props}>{children}</div>
);
export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`px-4 py-3 border-b ${className}`} {...props}>{children}</div>
);
export const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>{children}</h3>
);
export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);
