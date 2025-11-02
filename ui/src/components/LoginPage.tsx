import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Search className="w-8 h-8 text-primary" strokeWidth={2.5} />
          <span 
            className="tracking-tight uppercase text-foreground"
            style={{ 
              fontFamily: "'Anton', sans-serif",
              fontSize: '2rem',
              letterSpacing: '0.02em'
            }}
          >
            Lost & Found
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-card p-8 rounded-sm border border-border shadow-sm">
          <h1 
            className="uppercase tracking-tight text-foreground mb-8"
            style={{ 
              fontFamily: "'Anton', sans-serif",
              fontSize: '2rem',
              letterSpacing: '0.02em'
            }}
          >
            LOGIN TO YOUR ACCOUNT
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="email"
                className="uppercase tracking-widest text-muted-foreground"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Email / Username
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password"
                className="uppercase tracking-widest text-muted-foreground"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-input"
                required
              />
            </div>

            <button
              type="button"
              className="text-primary hover:underline"
              style={{ fontSize: '0.875rem' }}
            >
              Forgot Password?
            </button>

            <Button 
              type="submit"
              className="w-full uppercase tracking-wide bg-primary hover:bg-primary/90"
              style={{ letterSpacing: '0.05em', padding: '1.25rem' }}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center text-muted-foreground" style={{ fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-primary hover:underline"
            >
              REGISTER
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-muted-foreground hover:text-foreground uppercase tracking-wide transition-colors"
            style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
