import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1>InterAlyze</h1>
      </div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <Avatar className="avatar">
          <AvatarImage src="/path-to-profile.jpg" alt="Ahmet Ince" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <p className="name">Ahmet Ince</p>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Button variant="ghost" className="active">
              Overview
            </Button>
          </li>
          <li>
            <Button variant="ghost">Candidates</Button>
          </li>
          <li>
            <Button variant="ghost">Create Candidate</Button>
          </li>
          <li>
            <Button variant="ghost">Generate Reports</Button>
          </li>
          <li>
            <Button variant="ghost">My Company</Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
