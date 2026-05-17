import { motion } from "framer-motion";
import { History } from "lucide-react";

interface HeaderProps {
  onShowHistory?: () => void;
}

const Header = ({ onShowHistory }: HeaderProps) => {
  return (
    <header
      className="sticky top-0 z-40 w-full h-16 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(20, 19, 19, 0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #444748",
      }}
    >
      {onShowHistory && (
        <button
          onClick={onShowHistory}
          style={{
            position: "absolute",
            right: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            backgroundColor: "#1c1b1b",
            border: "1px solid #444748",
            borderRadius: 0,
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ffffff"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "#444748"}
        >
          <History style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">My Orders</span>
        </button>
      )}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "clamp(22px, 6vw, 32px)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "#ffffff",
          textTransform: "uppercase",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        PAPICHOLOS
      </motion.h1>
    </header>
  );
};

export default Header;
