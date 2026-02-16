import { Building2, LayoutDashboard, FolderKanban, Bot, Box, LogOut, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Box, label: "3D Viewer", path: "/viewer" },
  { icon: Bot, label: "AI Chat", path: "/chat" },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col gradient-steel border-r border-sidebar-border">
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="gradient-amber rounded-lg p-2">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-mono text-lg font-bold text-steel-foreground">BuildWise</span>
      </div>

      <div className="p-4">
        <button
          onClick={() => navigate("/projects/new")}
          className="flex w-full items-center gap-2 rounded-lg gradient-amber px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-amber hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              location.pathname.startsWith(item.path)
                ? "bg-sidebar-accent text-primary font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full gradient-amber flex items-center justify-center text-xs font-bold text-primary-foreground">
            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-steel-foreground truncate">{profile?.full_name || "User"}</p>
            <p className="text-xs text-concrete capitalize">{profile?.role?.replace("_", " ") || "User"}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-concrete hover:bg-sidebar-accent hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
