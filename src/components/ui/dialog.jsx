// src/components/ui/dialog.jsx
import React from "react";
export const Dialog = ({ open = true, children }) => open ? <div className="fixed inset-0 z-40">{children}</div> : null;
export const DialogContent = ({ children, className = "" }) => <div className={`m-6 p-4 bg-white rounded ${className}`}>{children}</div>;
export const DialogHeader = ({ children }) => <div className="mb-3">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className="text-lg font-bold">{children}</h3>;
