import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import CanteenList from "./pages/student/CanteenList";
import MenuPage from "./pages/student/MenuPage";
import Cart from "./pages/student/Cart";
import OrderSuccess from "./pages/student/OrderSuccess";

import OwnerDashboard from "./pages/owner/OwnerDashboard";

import AddMenu from "./pages/owner/AddMenu";
import Orders from "./pages/owner/Orders";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");

    if (token && storedUser && storedRole) {
        setUser({ name: storedUser, role: storedRole });
    }
  }, []);


  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        return prev.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item._id === itemId) {
            const newQuantity = item.quantity + change;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); 
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items forr badge
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-900">
      {!hideNavbar && <Navbar cartCount={cartItemCount} user={user} setUser={setUser} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

      <div className="w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student flow */}
          <Route path="/student/canteens" element={<CanteenList searchQuery={searchQuery} />} />
          <Route path="/student/canteens/:canteenId/menu" element={<MenuPage addToCart={addToCart} cart={cart} />} />
          <Route path="/student/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} clearCart={clearCart} />} />
          <Route path="/student/order-success" element={<OrderSuccess />} />

          {/* Owner flow */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/add-menu" element={<AddMenu />} />
          <Route path="/owner/orders" element={<Orders />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
