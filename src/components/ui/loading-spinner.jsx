// src/components/ui/loading-spinner.jsx
import React from 'react';
import { Loader2, Bot } from 'lucide-react'; // Ensure Lucide React is installed: npm install lucide-react

export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
    </div>
  );
};

export const AIThinkingIndicator = ({ text = "AI is thinking..." }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-pulse">
      <Bot className="w-6 h-6 text-blue-600" />
      <div>
        <p className="text-sm font-medium text-blue-700">{text}</p>
        <p className="text-xs text-blue-600">Analyzing with advanced AI...</p>
      </div>
    </div>
  );
};