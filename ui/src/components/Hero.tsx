import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface HeroProps {
  onLostClick: () => void;
  onFoundClick: () => void;
  heroImage: string;
}

export function Hero({ onLostClick, onFoundClick, heroImage }: HeroProps) {
  return (
    <section className="relative bg-card">
      <div className="max-w-[1600px] mx-auto px-8 py-20">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left: Bold Headline */}
          <div className="col-span-7 space-y-8">
            <h1 
              className="uppercase leading-[0.9] tracking-tight text-foreground"
              style={{ 
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                letterSpacing: '-0.02em'
              }}
            >
              REUNITING<br />
              WHAT'S LOST –<br />
              <span className="text-primary">A COMMUNITY</span><br />
              MOMENT
            </h1>

            <p className="text-muted-foreground max-w-md" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
              Connect with dedicated finders and reclaim your valued possessions swiftly.
            </p>

            {/* CTAs */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={onLostClick}
                variant="outline"
                className="uppercase tracking-wide border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                style={{ letterSpacing: '0.05em', padding: '1.5rem 2rem' }}
              >
                I've Lost Something
              </Button>
              <Button 
                onClick={onFoundClick}
                className="uppercase tracking-wide bg-primary hover:bg-primary/90"
                style={{ letterSpacing: '0.05em', padding: '1.5rem 2rem' }}
              >
                I've Found Something
              </Button>
            </div>
          </div>

          {/* Right: Hero Image - Asymmetrical positioning */}
          <div className="col-span-5 relative">
            <div 
              className="relative overflow-hidden rounded-sm shadow-lg"
              style={{ aspectRatio: '4/5' }}
            >
              <img 
                src={heroImage}
                alt="Community connection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
