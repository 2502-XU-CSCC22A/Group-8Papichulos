import { motion } from "framer-motion";
import { History } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  onShowHistory?: () => void;
}

const Header = ({ onShowHistory }: HeaderProps) => {
  const { userId } = useCart();

  return (
    <header className="relative bg-primary text-primary-foreground px-6 h-32 flex items-center justify-center text-center overflow-visible">
      {/* My Orders Button - Top Right */}
      <button
        onClick={onShowHistory}
        className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 active:scale-95"
      >
        <History className="h-3 w-3" />
        My Orders
      </button>

      {/* Background image — low opacity, covers full header */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/BACKGROUND.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.075,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <div className="flex justify-center">
          <img
            src="/PAPICHOLOS-LOGO.png"
            alt="Papicholo's CDO"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 sm:h-24 w-auto object-contain"
          />
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
