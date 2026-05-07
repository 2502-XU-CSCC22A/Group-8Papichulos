import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover transition-transform duration-300 hover:scale-105 ${item.is_active === false ? "grayscale opacity-50" : ""}`}
          loading="lazy"
        />
        {item.is_active === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
            <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight text-card-foreground">{item.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-card-foreground">₱{item.price}</span>
          <motion.button
            whileTap={item.is_active !== false ? { scale: 0.9 } : undefined}
            onClick={item.is_active !== false ? handleAdd : undefined}
            disabled={item.is_active === false}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              item.is_active === false
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : added
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/80"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
