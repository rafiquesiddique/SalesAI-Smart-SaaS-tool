// src/components/ui/skeleton.jsx
import React from "react";
export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 ${className}`} />
);
