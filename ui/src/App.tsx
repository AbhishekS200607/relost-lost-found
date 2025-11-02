import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RecentlyFoundSection } from "./components/RecentlyFoundSection";
import { ItemDetailModal } from "./components/ItemDetailModal";
import { PostItemModal } from "./components/PostItemModal";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Footer } from "./components/Footer";

// Mock data for items
const mockItems = [
  {
    id: "1",
    category: "WALLET",
    description: "Black leather wallet, slightly worn on edges",
    location: "Park St.",
    date: "OCT 26",
    fullDescription: "A black leather wallet, slightly worn on edges. Contains a loyalty card for 'Coffee Bean' and a single business card.",
    postedBy: "ANONYMOUS USER [ID: A1B2C3D4]"
  },
  {
    id: "2",
    category: "KEYS",
    description: "Set of 4 keys with blue keychain",
    location: "Library",
    date: "OCT 25",
    fullDescription: "Set of 4 keys on a ring with a blue fabric keychain that says 'Home Sweet Home'.",
  },
  {
    id: "3",
    category: "PHONE",
    description: "iPhone with cracked screen protector",
    location: "Station",
    date: "OCT 27",
    fullDescription: "Black iPhone 12 with a cracked screen protector. Phone case has a floral pattern.",
  },
  {
    id: "4",
    category: "WATCH",
    description: "Silver analog watch with brown leather strap",
    location: "Mall",
    date: "OCT 24",
    fullDescription: "Silver analog watch with a brown leather strap. Watch face has Roman numerals.",
  },
  {
    id: "5",
    category: "LAPTOP",
    description: "MacBook Pro 13-inch with stickers",
    location: "Park St.",
    date: "OCT 28",
    fullDescription: "13-inch MacBook Pro with various tech company stickers on the lid. Silver model.",
  },
  {
    id: "6",
    category: "BAG",
    description: "Navy blue backpack with laptop compartment",
    location: "Library",
    date: "OCT 23",
    fullDescription: "Navy blue backpack with padded laptop compartment. Has a small tear on the side pocket.",
  },
  {
    id: "7",
    category: "BOOK",
    description: "Hardcover novel with bookmark inside",
    location: "Station",
    date: "OCT 29",
    fullDescription: "Hardcover copy of '1984' by George Orwell with a handwritten bookmark inside.",
  },
  {
    id: "8",
    category: "CARDS",
    description: "Credit card holder with multiple cards",
    location: "Mall",
    date: "OCT 22",
    fullDescription: "Black leather credit card holder containing multiple cards. No cash inside.",
  },
  {
    id: "9",
    category: "WALLET",
    description: "Brown suede wallet with coin pocket",
    location: "Park St.",
    date: "OCT 30",
    fullDescription: "Brown suede wallet with an external coin pocket and zipper closure.",
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState<typeof mockItems[0] | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const heroImage = "https://images.unsplash.com/photo-1760637627195-6c513252431b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb25uZWN0aW9uJTIwaGFwcHl8ZW58MXx8fHwxNzYxOTMzNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  const handleItemClick = (item: typeof mockItems[0]) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleFoundItemClick = () => {
    setIsPostModalOpen(true);
  };

  if (currentPage === "login") {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === "register") {
    return <RegisterPage onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        onFoundItemClick={handleFoundItemClick}
      />
      
      <main className="flex-1">
        <Hero 
          onLostClick={() => console.log("Lost item clicked")}
          onFoundClick={handleFoundItemClick}
          heroImage={heroImage}
        />
        
        <RecentlyFoundSection 
          items={mockItems}
          onItemClick={handleItemClick}
        />
      </main>

      <Footer />

      <ItemDetailModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        item={selectedItem}
      />

      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
}

export default App;
