import React from "react";

export function ChartContainer({ config, children, className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
