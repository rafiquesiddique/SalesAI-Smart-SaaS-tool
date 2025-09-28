// src/components/ui/select.jsx
import React, { createContext, useContext } from "react";

const SelectContext = createContext({});
export function Select({ value, onValueChange, children }) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
}
export function SelectTrigger({ children }) { return <div>{children}</div>; }
export function SelectContent({ children }) { return <div>{children}</div>; }
export function SelectItem({ value, children }) {
  const ctx = useContext(SelectContext);
  return <div role="button" onClick={() => ctx.onValueChange && ctx.onValueChange(value)} className="px-2 py-1 cursor-pointer">{children}</div>;
}
export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx.value || placeholder}</span>;
}
