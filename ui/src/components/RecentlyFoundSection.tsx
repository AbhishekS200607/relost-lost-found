import { useState } from "react";
import { ItemCard } from "./ItemCard";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Item {
  id: string;
  category: string;
  description: string;
  location: string;
  date: string;
  fullDescription?: string;
  postedBy?: string;
}

interface RecentlyFoundSectionProps {
  onItemClick: (item: Item) => void;
  items: Item[];
}

export function RecentlyFoundSection({ onItemClick, items }: RecentlyFoundSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || item.location.includes(locationFilter);
    return matchesCategory && matchesLocation;
  });

  return (
    <section className="bg-background py-20">
      <div className="max-w-[1600px] mx-auto px-8">
        {/* Section Header - Asymmetrical */}
        <div className="flex items-end justify-between mb-12">
          <h2 
            className="uppercase leading-[0.9] tracking-tight text-foreground"
            style={{ 
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              letterSpacing: '-0.01em'
            }}
          >
            RECENTLY<br />
            <span className="text-primary">FOUND ITEMS</span>
          </h2>

          {/* Filters - Offset positioning */}
          <div className="flex gap-4 items-center">
            <div className="space-y-1">
              <label 
                className="uppercase text-muted-foreground block"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Category
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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

            <div className="space-y-1">
              <label 
                className="uppercase text-muted-foreground block"
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Location
              </label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Park">Park St.</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Station">Station</SelectItem>
                  <SelectItem value="Mall">Mall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(categoryFilter !== "all" || locationFilter !== "all") && (
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setLocationFilter("all");
                }}
                className="text-muted-foreground hover:text-foreground uppercase mt-6 transition-colors"
                style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Items Grid - Asymmetrical layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id}
              className={index % 5 === 2 ? "md:translate-y-8" : ""}
            >
              <ItemCard
                {...item}
                onClick={() => onItemClick(item)}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Button 
            variant="outline"
            className="uppercase tracking-wide border-2"
            style={{ letterSpacing: '0.05em', padding: '1.25rem 3rem' }}
          >
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
}
