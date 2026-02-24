import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { placeOrder } from '../../services/api';
import LoginModal from '../../components/LoginModal';

const Cart = ({ cart, updateQuantity, clearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Calculate total price based on quantity
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    // Check if user is logged in
    const userRole = localStorage.getItem("userRole"); 
    
    if (!userRole) {
        setIsLoginModalOpen(true);
        return;
    }

    try {
        const orderData = {
            items: cart,
            total: totalPrice,
            // In real app, userId would be extracted from token in backend
        };
        const response = await placeOrder(orderData);
        if (response.success) {
            clearCart();
            // Provide token from response
            navigate('/student/order-success', { state: { token: response.token } });
        } else {
            alert("Failed to place order");
        }
    } catch (error) {
        console.error("Order error:", error);
        alert("Something went wrong while placing order");
    }
  };

  const handleLoginSuccess = () => {
      // User just logged in via modal
      setIsLoginModalOpen(false);
      handlePlaceOrder(); // Retry placing order
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <div className="bg-orange-50 p-6 rounded-full mb-4">
            <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <div className="flex gap-4">
             <button 
                onClick={() => navigate('/student/canteens')}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
            >
                Browse Canteens
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-12 px-4 md:px-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
        <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Your Bag</h1>
            <p className="text-gray-500 mt-2 font-medium opacity-80">Review and checkout your items.</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{cart.length} Items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-white/50 flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gray-50 rounded-[2rem] overflow-hidden shadow-inner flex-center">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
                
                <div className="flex-1 w-full min-w-0 flex flex-col justify-between h-full py-2">
                    <div className="flex justify-between items-start mb-2">
                         <div>
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 truncate mb-1">{item.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.canteenName || 'College Canteen'}</p>
                         </div>
                         <button 
                            onClick={() => updateQuantity(item.id, -1 * item.quantity)}
                            className="p-3 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all duration-300"
                            title="Remove item"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-50">Subtotal</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight">₹{item.price * item.quantity}</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 bg-gray-50/50 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-100 shadow-inner">
                            <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-900 font-black hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                                -
                            </button>
                            <span className="font-black text-gray-900 w-6 text-center text-lg">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-900 font-black hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {/* Bill Details */}
        <div className="lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white sticky top-28 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Summary</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items Total</span>
                        <span className="font-black text-gray-900">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Convenience</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full">Free</span>
                    </div>
                    <div className="pt-6 mt-4 border-t border-dashed border-gray-200 flex justify-between items-baseline">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">Grand Total</span>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{totalPrice}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl hover:shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <span>Confirm Order</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <p className="text-center text-[8px] font-black uppercase tracking-widest text-gray-300">
                        100% SECURE CHECKOUT • NO HIDDEN FEES
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Login Modal Integration */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Cart;