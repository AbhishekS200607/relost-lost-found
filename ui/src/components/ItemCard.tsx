import { Wallet, Key, Phone, Briefcase, Watch, CreditCard, Book, Backpack } from "lucide-react";
import { Button } from "./ui/button";

interface ItemCardProps {
  id: string;
  category: string;
  description: string;
  location: string;
  date: string;
  onClick: () => void;
}

const categoryIcons = {
  WALLET: Wallet,
  KEYS: Key,
  PHONE: Phone,
  LAPTOP: Briefcase,
  WATCH: Watch,
  CARDS: CreditCard,
  BOOK: Book,
  BAG: Backpack,
};

export function ItemCard({ category, description, location, date, onClick }: ItemCardProps) {
  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Briefcase;
  
  return (
    <div className="bg-card rounded-sm border border-border hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Icon area with accent */}
      <div className="relative p-8 bg-muted/30 flex items-center justify-center border-b border-border">
        <div className="relative">
          <IconComponent 
            className="w-20 h-20 text-primary" 
            strokeWidth={1.5}
          />
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-secondary/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div 
          className="uppercase tracking-widest text-primary"
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
        >
          {category}
        </div>
        
        <p className="text-foreground min-h-[3rem]" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
          {description}
        </p>

        <div className="flex items-center gap-2 text-muted-foreground pt-2" style={{ fontSize: '0.875rem' }}>
          <span className="uppercase tracking-wide">{location}</span>
          <span>|</span>
          <span className="uppercase tracking-wide">{date}</span>
        </div>

        <Button 
          onClick={onClick}
          variant="outline"
          className="w-full mt-4 uppercase tracking-wide border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
          style={{ letterSpacing: '0.05em' }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
