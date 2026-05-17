import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import { Clock, ChefHat, CheckCircle } from "lucide-react";

interface OrderStatusBarProps {
  orderId: string;
  onTap: () => void;
  onDismiss: () => void; // called when order is completed/cancelled
}

const STATUS_CONFIG = {
  pending: {
    label: "Order Received",
    sub: "Waiting for kitchen…",
    icon: Clock,
    color: "#ffffff",
    pulse: true,
  },
  preparing: {
    label: "Preparing Your Order",
    sub: "The kitchen is on it!",
    icon: ChefHat,
    color: "#fbbf24",
    pulse: true,
  },
  ready_for_pickup: {
    label: "Ready for Pickup!",
    sub: "Please proceed to the counter.",
    icon: CheckCircle,
    color: "#4ade80",
    pulse: true,
  },
  completed: {
    label: "Order Complete",
    sub: "Thank you! Enjoy your food 🎉",
    icon: CheckCircle,
    color: "#4ade80",
    pulse: false,
  },
  cancelled: {
    label: "Order Cancelled",
    sub: "Please see a staff member.",
    icon: Clock,
    color: "#ef4444",
    pulse: false,
  },
};

const OrderStatusBar = ({ orderId, onTap, onDismiss }: OrderStatusBarProps) => {
  const { order, loading, estimatedMinutes } = useOrderStatus(orderId);

  // Auto-dismiss when completed or cancelled
  useEffect(() => {
    if (!order) return;
    if (order.status === "completed" || order.status === "cancelled") {
      const t = setTimeout(() => onDismiss(), 4000); // 4s delay so user sees final state
      return () => clearTimeout(t);
    }
  }, [order?.status]);

  if (loading || !order) return null;

  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const isDone = order.status === "completed" || order.status === "cancelled";
  const isPickup = order.table_number === "STORE-PICKUP" || order.table_number.startsWith("PUP-");

  // Customize labels based on order type
  let displayLabel = cfg.label;
  let displaySub = cfg.sub;
  if (isPickup) {
    if (order.status === "pending") {
      displaySub = "Waiting for counter…";
    } else if (order.status === "preparing") {
      displayLabel = "Preparing the Order";
      displaySub = "We are working on it!";
    } else if (order.status === "ready_for_pickup") {
      displayLabel = "Order Ready for Pickup";
    } else if (order.status === "completed") {
      displayLabel = "Order Picked Up";
    }
  } else {
    // Dine-in specific overrides
    if (order.status === "ready_for_pickup") {
      displayLabel = "Food is Ready";
      displaySub = "Your food is on the way!";
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 48, // just below CartBar (z-50)
          padding: "12px 16px",
          backgroundColor: "rgba(20, 19, 19, 0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${cfg.color}40`,
        }}
      >
        <button
          onClick={onTap}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
          }}
        >
          {/* Status icon with optional pulse ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                border: `1px solid ${cfg.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${cfg.color}15`,
              }}
            >
              <Icon style={{ width: 20, height: 20, color: cfg.color }} />
            </div>
            {cfg.pulse && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: cfg.color,
                  animation: "statusPulse 1.5s ease-in-out infinite",
                }}
              />
            )}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 2,
                letterSpacing: "-0.01em",
              }}
            >
              {displayLabel}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "#8e9192",
                letterSpacing: "0.02em",
              }}
            >
              {isPickup ? `Pickup Code: ${order.table_number}` : `Table ${order.table_number}`} · {displaySub}
            </p>
          </div>

          {/* Right side: wait time or tap hint */}
          <div
            style={{
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {!isDone && estimatedMinutes > 0 ? (
              <>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: cfg.color,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    marginBottom: 2,
                  }}
                >
                  ~{estimatedMinutes}m
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    color: "#8e9192",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  wait
                </p>
              </>
            ) : (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  color: "#8e9192",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {isDone ? "✓ Done" : "Tap for details"}
              </p>
            )}
          </div>
        </button>

        {/* Keyframe */}
        <style>{`
          @keyframes statusPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.4; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderStatusBar;
