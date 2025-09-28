// // src/components/ui/input.jsx
// import React from "react";
// export const Input = ({ className = "", ...props }) => (
//   <input className={`border rounded px-3 py-2 ${className}`} {...props} />
// );

// src/components/ui/button.jsx
import React from "react";
import { cn } from "../../utils";

export const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default",
  disabled = false,
  type = "button",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-300 bg-white hover:bg-slate-50",
    ghost: "hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};