import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown, ChevronUp, History, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserHistoryDrawerProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const UserHistoryDrawer = ({ userId, open, onClose }: UserHistoryDrawerProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchOrders();
    }
  }, [open, userId]);

  const fetchOrders = async () => {
    if (!userId) {
      console.warn("Cannot fetch orders: userId is empty");
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching orders for userId:", userId);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
        throw error;
      }
      console.log("Orders found:", data?.length || 0);
      if (data) setOrders(data);
    } catch (err) {
      console.error("Error fetching user history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "preparing":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <DrawerTitle>My Orders</DrawerTitle>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Fetching your history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">No orders yet</p>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Your order history will appear here once you place your first order.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-10">
              {orders.map((order) => {
                const isExpanded = expandedId === order.id;
                const date = new Date(order.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const time = new Date(order.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Header Summary */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="cursor-pointer p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{date} • {time}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`rounded-full capitalize text-[10px] font-bold px-2.5 py-0.5 ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            {order.customer_name?.split(" (ID:")[0]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'Item' : 'Items'}
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Details section */}
                    {isExpanded && (
                      <div className="border-t bg-muted/30 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Order Details</p>
                        <div className="space-y-3 mb-4">
                          {order.order_items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm items-center">
                              <div className="flex items-center gap-2">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded">
                                  {item.quantity}
                                </span>
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <span className="text-muted-foreground">₱{(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-3 border-t border-dashed space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Order Time</span>
                            <span className="font-medium">{date} at {time}</span>
                          </div>
                          {order.phone_number && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Phone Number</span>
                              <span className="font-medium">{order.phone_number}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-semibold uppercase">{(order.payment_method === "gcash" || order.payment_method === "online") ? "GCash / Online" : "Cash"}</span>
                          </div>
                          {order.pickup_id && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Pickup ID</span>
                              <span className="font-bold text-primary tracking-wider">{order.pickup_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default UserHistoryDrawer;
