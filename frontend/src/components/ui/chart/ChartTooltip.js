import React from "react";

export function ChartTooltip({ cursor, content }) {
  return (
    <div>
      <div>{cursor && <div className="chart-tooltip-cursor" />}</div>
      {content}
    </div>
  );
}
