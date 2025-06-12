import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Cart from "./Cart";

const MobileCart = () => {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="fixed bottom-4 right-4 md:hidden bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full text-xs">
            {totalItems}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:w-[380px] p-0">
        <div className="h-full overflow-auto py-6 px-4">
          <Cart />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileCart;