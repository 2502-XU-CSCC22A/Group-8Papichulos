import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import MenuGrid from "@/components/MenuGrid";
import CartBar from "@/components/CartBar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderConfirmation from "@/components/OrderConfirmation";
import Footer from "@/components/Footer";
import UserHistoryDrawer from "@/components/UserHistoryDrawer";
import { useCart } from "@/contexts/CartContext";

type View = "menu" | "confirmed";

const IndexContent = () => {
  const [view, setView] = useState<View>("menu");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { userId } = useCart();

  if (view === "confirmed") {
    return <OrderConfirmation onBack={() => setView("menu")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onShowHistory={() => setHistoryOpen(true)} />
      <MenuGrid />
      <Footer />
      <UserHistoryDrawer
        userId={userId}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <CartBar onOpen={() => setCartOpen(true)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setTimeout(() => setCheckoutOpen(true), 300);
        }}
      />
      <CheckoutDrawer
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={() => {
          setCheckoutOpen(false);
          setView("confirmed");
        }}
      />
    </div>
  );
};

const Index = () => (
  <CartProvider>
    <IndexContent />
  </CartProvider>
);

export default Index;
