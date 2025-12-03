// Navigation bar component with links to all main pages
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User as UserIcon, PlusCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { authApi } from "@/api/authApi";
import { User } from "@/types/event";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user", error);
          // If token is invalid, logout
          authApi.logout();
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">
            What's Happening? - Local Event Discovery
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/events" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Events
          </Link>
          {isAuthenticated && (
            <Link to="/create-event" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Create Event
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {user.first_name || user.username}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/register">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
