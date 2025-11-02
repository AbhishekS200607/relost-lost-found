import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostItemModal({ isOpen, onClose }: PostItemModalProps) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ category, description, location, date });
    onClose();
  };

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
              POST A FOUND ITEM
            </DialogTitle>
            <p className="text-muted-foreground pt-2" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              Please do not include sensitive personal details in the description. Focus on unique identifiers only.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="category"
                className="uppercase tracking-widest text-muted-foreground"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WALLET">Wallet</SelectItem>
                  <SelectItem value="KEYS">Keys</SelectItem>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="LAPTOP">Laptop</SelectItem>
                  <SelectItem value="WATCH">Watch</SelectItem>
                  <SelectItem value="CARDS">Cards</SelectItem>
                  <SelectItem value="BOOK">Book</SelectItem>
                  <SelectItem value="BAG">Bag</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="description"
                className="uppercase tracking-widest text-muted-foreground"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input-background border-input min-h-[120px]"
                placeholder="Describe the item with unique identifiers (color, brand, distinctive features)..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="location"
                  className="uppercase tracking-widest text-muted-foreground"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                >
                  Location Found
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-input-background border-input"
                  placeholder="e.g., Central Park, NYC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="date"
                  className="uppercase tracking-widest text-muted-foreground"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                >
                  Date Found
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-input-background border-input"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button 
                type="submit"
                className="flex-1 uppercase tracking-wide bg-primary hover:bg-primary/90"
                style={{ letterSpacing: '0.05em', padding: '1.25rem' }}
              >
                Submit Post
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="uppercase tracking-wide"
                style={{ letterSpacing: '0.05em', padding: '1.25rem' }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
