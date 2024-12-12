import React from "react";

export function ChartTooltipContent({ labelFormatter, indicator }) {
  return (
    <div className="chart-tooltip-content">
      <div>
        {labelFormatter ? labelFormatter() : "Tooltip"}
        {indicator && <span>{indicator}</span>}
      </div>
    </div>
  );
}
