import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Scissors, CalendarDays, Archive, Users, Tag, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Agenda", path: "/", icon: CalendarDays },
  { label: "Fechamentos", path: "/closures", icon: Archive },
  { label: "Clientes", path: "/clients", icon: Users },
  { label: "Categorias", path: "/categories", icon: Tag },
];

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();   
  const [mobileOpen, setMobileOpen] = useState(false);
  console.log(user)
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path) || location.pathname === path;
  };

  return (
    <header className="bg-card border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground text-lg hidden sm:inline">
                  Barber Admin
                </span>
                {user?.barbershopname && (
                  <p className="text-xs text-muted-foreground -mt-1 hidden sm:block">
                    {user.barbershopname}
                  </p>
                )}
              </div>
            </button>
          </div>

          {user?.barbershopname && (
            <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>)}

          {user?.barbershopname && (<div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-muted-foreground hover:text-destructive hidden sm:flex"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          )}
        </div>
  
        {mobileOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left",
                  isActive(item.path)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-muted w-full text-left mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}