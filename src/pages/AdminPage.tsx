
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductManager from "@/components/ProductManager";
import TinkoffRefund from "@/components/TinkoffRefund";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast({
      title: "Успешно",
      description: "Вы вышли из системы"
    });
    navigate("/admin-login");
  };

  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Панель администратора</h1>
        <Button variant="outline" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
      <div className="p-4 space-y-6">
        <TinkoffRefund />
        <ProductManager />
      </div>
    </div>
  );
};

export default AdminPage;
