export function Footer() {
  return (
    <footer className="bg-foreground text-card py-12">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <nav className="flex gap-8">
            <a 
              href="#"
              className="uppercase tracking-wide hover:text-primary transition-colors"
              style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
            >
              About Us
            </a>
            <a 
              href="#"
              className="uppercase tracking-wide hover:text-primary transition-colors"
              style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
            >
              Contact
            </a>
            <a 
              href="#"
              className="uppercase tracking-wide hover:text-primary transition-colors"
              style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
            >
              Privacy Policy
            </a>
          </nav>

          {/* Copyright */}
          <div 
            className="text-muted-foreground/70 uppercase tracking-widest"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            © 2025 Lost & Found. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
