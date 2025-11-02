import { Wallet, Key, Phone, Briefcase, Watch, CreditCard, Book, Backpack, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    category: string;
    description: string;
    location: string;
    date: string;
    fullDescription?: string;
    postedBy?: string;
  } | null;
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

export function ItemDetailModal({ isOpen, onClose, item }: ItemDetailModalProps) {
  if (!item) return null;

  const IconComponent = categoryIcons[item.category as keyof typeof categoryIcons] || Briefcase;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8 space-y-6">
          {/* Header */}
          <DialogHeader>
            <DialogTitle 
              className="uppercase tracking-tight text-foreground"
              style={{ 
                fontFamily: "'Anton', sans-serif",
                fontSize: '2rem',
                letterSpacing: '0.02em'
              }}
            >
              FOUND ITEM
            </DialogTitle>
          </DialogHeader>

          {/* Icon Display */}
          <div className="flex justify-center py-8 bg-muted/30 rounded-sm relative overflow-hidden">
            <IconComponent 
              className="w-32 h-32 text-primary relative z-10" 
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div 
                className="uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Category
              </div>
              <div 
                className="uppercase tracking-wide text-primary"
                style={{ fontSize: '1.125rem', letterSpacing: '0.05em' }}
              >
                {item.category}
              </div>
            </div>

            <div>
              <div 
                className="uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Description
              </div>
              <p className="text-foreground" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                {item.fullDescription || item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div 
                  className="uppercase tracking-widest text-muted-foreground mb-1"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                >
                  Location Found
                </div>
                <div 
                  className="uppercase tracking-wide text-foreground"
                  style={{ fontSize: '1rem', letterSpacing: '0.05em' }}
                >
                  {item.location}
                </div>
              </div>

              <div>
                <div 
                  className="uppercase tracking-widest text-muted-foreground mb-1"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                >
                  Date Found
                </div>
                <div 
                  className="uppercase tracking-wide text-foreground"
                  style={{ fontSize: '1rem', letterSpacing: '0.05em' }}
                >
                  {item.date}
                </div>
              </div>
            </div>

            <div>
              <div 
                className="uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Posted By
              </div>
              <div className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                {item.postedBy || `ANONYMOUS USER [ID: ${item.id.slice(0, 8).toUpperCase()}]`}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <Button 
              className="flex-1 uppercase tracking-wide bg-primary hover:bg-primary/90"
              style={{ letterSpacing: '0.05em', padding: '1.25rem' }}
            >
              I Think This Is Mine
            </Button>
            <Button 
              variant="outline"
              className="uppercase tracking-wide text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              style={{ letterSpacing: '0.05em', padding: '1.25rem' }}
            >
              Delete My Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
