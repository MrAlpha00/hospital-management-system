import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  User, 
  Calendar, 
  FileText, 
  LogOut, 
  Shield, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) => {
    const isActive = location === href;
    return (
      <Link href={href} className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"}
      `}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{children}</span>
      </Link>
    );
  };

  const navItems = user?.role === "admin" ? [
    { href: "/admin", label: "Dashboard", icon: Activity },
    { href: "/admin/doctors", label: "Doctors", icon: User },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  ] : user ? [
    { href: "/dashboard", label: "Overview", icon: Activity },
    { href: "/dashboard/appointments", label: "My Appointments", icon: Calendar },
    { href: "/dashboard/reports", label: "Medical Reports", icon: FileText },
  ] : [
    { href: "/", label: "Home", icon: Activity },
    { href: "/doctors", label: "Our Doctors", icon: User },
    { href: "/contact", label: "Contact", icon: Calendar }, // Reusing Calendar icon as placeholder
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden md:inline-block">
              MediCare<span className="text-primary">Plus</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
                <Link href="/doctors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Doctors</Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button size="sm" className="rounded-full px-6">
                     Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex flex-col gap-2">
                   {navItems.map((item) => (
                    <div key={item.href} onClick={() => setIsOpen(false)}>
                      <NavLink href={item.href} icon={item.icon}>{item.label}</NavLink>
                    </div>
                  ))}
                </div>
                {user ? (
                  <Button variant="outline" onClick={() => { logout(); setIsOpen(false); }} className="justify-start gap-3">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 md:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
             <Activity className="w-5 h-5 text-primary" />
             <span className="font-bold text-foreground">MediCarePlus</span>
          </div>
          <p>&copy; {new Date().getFullYear()} MediCare Plus Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
