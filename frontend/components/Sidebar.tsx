import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

interface SidebarProps {
  currentPath: string; // Accept the current path as a prop
}

export default function Sidebar({ currentPath }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1>InterAlyze</h1>
      </div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <Avatar className="avatar">
        <AvatarImage src="/interviewer.jpg" alt="Aysel Tuzluca" className="avatar-image" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <p className="name">Aysel Tuzluca</p>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link
              href="/"
              className={`sidebar-link ${currentPath === "/" ? "active" : ""}`}
            >
              Overview
            </Link>
          </li>
          <li>
            <Link
              href="/candidates"
              className={`sidebar-link ${
                currentPath === "/candidates" ? "active" : ""
              }`}
            >
              Candidates
            </Link>
          </li>
          <li>
            <Link
              href="/create"
              className={`sidebar-link ${
                currentPath === "/create" ? "active" : ""
              }`}
            >
              Create Candidate
            </Link>
          </li>
          <li>
            <Link
              href="/reports"
              className={`sidebar-link ${
                currentPath === "/reports" ? "active" : ""
              }`}
            >
              Generate Reports
            </Link>
          </li>
          <li>
            <Link
              href="/company"
              className={`sidebar-link ${
                currentPath === "/company" ? "active" : ""
              }`}
            >
              My Company
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
