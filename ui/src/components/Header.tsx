import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onFoundItemClick: () => void;
}

export function Header({ onNavigate, currentPage, onFoundItemClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Search className="w-6 h-6 text-primary" strokeWidth={2.5} />
          <span 
            className="tracking-tight uppercase"
            style={{ 
              fontFamily: "'Anton', sans-serif",
              fontSize: '1.5rem',
              letterSpacing: '0.02em'
            }}
          >
            Lost & Found
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className={`uppercase tracking-wide transition-colors ${
              currentPage === 'home' 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
          >
            Browse Items
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={onFoundItemClick}
            className="uppercase tracking-wide bg-primary hover:bg-primary/90"
            style={{ letterSpacing: '0.05em' }}
          >
            Found an Item?
          </Button>
          <button
            onClick={() => onNavigate('login')}
            className="uppercase tracking-wide text-foreground hover:text-primary transition-colors"
            style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
