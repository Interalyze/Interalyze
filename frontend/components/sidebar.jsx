"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="flex flex-col w-64 h-full border-r bg-background">
      {/* Logo Section */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight">InterAlyze</h1>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b flex flex-col items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/path-to-profile.jpg" alt="Ahmet Ince" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <p className="mt-2 font-medium">Ahmet Ince</p>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className="w-full justify-start">
              Overview
            </Button>
          </Link>
          <Link href="/candidates" passHref>
            <Button variant="ghost" className="w-full justify-start">
              Candidates
            </Button>
          </Link>
          <Link href="/candidates/create" passHref>
            <Button variant="ghost" className="w-full justify-start">
              Create Candidate
            </Button>
          </Link>
          <Link href="/reports" passHref>
            <Button variant="ghost" className="w-full justify-start">
              Generate Reports
            </Button>
          </Link>
          <Link href="/company" passHref>
            <Button variant="ghost" className="w-full justify-start">
              My Company
            </Button>
          </Link>
        </nav>
      </ScrollArea>
    </aside>
  );
}


//  SİDE BAR
// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Link from "next/link";

// export function Sidebar() {
//   return (
//     <aside className="flex flex-col w-64 h-full border-r bg-background">
//       {/* Logo Section */}
//       <div className="p-4 border-b">
//         <h1 className="text-xl font-semibold tracking-tight">InterAlyze</h1>
//       </div>

//       {/* User Profile Section */}
//       <div className="p-4 border-b flex flex-col items-center">
//         <Avatar className="h-16 w-16">
//           <AvatarImage src="/path-to-profile.jpg" alt="Ahmet Ince" />
//           <AvatarFallback>AI</AvatarFallback>
//         </Avatar>
//         <p className="mt-2 font-medium">Ahmet Ince</p>
//       </div>

//       {/* Navigation Links */}
//       <ScrollArea className="flex-1 p-4">
//         <nav className="space-y-2">
//           <Link href="/dashboard" passHref>
//             <Button variant="ghost" className="w-full justify-start">
//               Overview
//             </Button>
//           </Link>
//           <Link href="/candidates" passHref>
//             <Button variant="ghost" className="w-full justify-start">
//               Candidates
//             </Button>
//           </Link>
//           <Link href="/candidates/create" passHref>
//             <Button variant="ghost" className="w-full justify-start">
//               Create Candidate
//             </Button>
//           </Link>
//           <Link href="/reports" passHref>
//             <Button variant="ghost" className="w-full justify-start">
//               Generate Reports
//             </Button>
//           </Link>
//           <Link href="/company" passHref>
//             <Button variant="ghost" className="w-full justify-start">
//               My Company
//             </Button>
//           </Link>
//         </nav>
//       </ScrollArea>
//     </aside>
//   );
// }



//  WITHOUT SIDEBAR
// "use client";

// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export function Sidebar() {
//   return (
//     <aside className="flex flex-col w-64 h-full border-r bg-white">
//       {/* Logo Section */}
//       <div className="p-4 border-b">
//         <h1 className="text-xl font-semibold tracking-tight">InterAlyze</h1>
//       </div>

//       {/* User Profile Section */}
//       <div className="flex flex-col items-center p-4 border-b">
//         <Avatar className="h-16 w-16">
//           <AvatarImage src="/path-to-profile.jpg" alt="Ahmet Ince" />
//           <AvatarFallback>AI</AvatarFallback>
//         </Avatar>
//         <p className="mt-2 font-medium">Ahmet Ince</p>
//       </div>

//       {/* Navigation Section */}
//       <nav className="flex-1 p-4">
//         <ul className="space-y-2">
//           <li>
//             <Button variant="ghost" className="w-full justify-start">
//               Overview
//             </Button>
//           </li>
//           <li>
//             <Button variant="ghost" className="w-full justify-start">
//               Candidates
//             </Button>
//           </li>
//           <li>
//             <Button variant="ghost" className="w-full justify-start">
//               Create Candidate
//             </Button>
//           </li>
//           <li>
//             <Button variant="ghost" className="w-full justify-start">
//               Generate Reports
//             </Button>
//           </li>
//           <li>
//             <Button variant="ghost" className="w-full justify-start">
//               My Company
//             </Button>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// }
