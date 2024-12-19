"use client";

import React from "react";
import { Sidebar } from "./sidebar";

export function SidebarLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}


// "use client";

// import React from "react";
// import { Sidebar } from "./sidebar";

// export function SidebarLayout({ children }) {
//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar />
//       <div className="flex-1 overflow-y-auto">
//         {children}
//       </div>
//     </div>
//   );
// }
