import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders, getAllCanteens } from "../../services/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Live tracking
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [orderData, canteenData] = await Promise.all([
        getMyOrders(),
        getAllCanteens(),
      ]);
      setOrders(orderData);
      setCanteens(canteenData);
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCanteenInfo = (canteenId) => {
    return canteens.find((c) => c._id === canteenId) || { name: "Canteen", image: "" };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Preparing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Ready":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Order History</h1>
          <p className="text-gray-500 mt-2 font-medium opacity-80">Track and view all your campus meals.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't ordered anything yet. Time to satisfy that hunger!</p>
            <button
              onClick={() => navigate("/student/canteens")}
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-lg hover:shadow-orange-500/20"
            >
              Browse Canteens
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const canteen = getCanteenInfo(order.canteen);
              return (
                <div key={order._id} className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                    {/* Canteen Image */}
                    <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={canteen.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop"}
                        alt={canteen.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 leading-none mb-1">{canteen.name}</h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                                {order.paymentStatus}
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600 font-medium">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-400 font-bold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Total Price</span>
                          <span className="text-2xl font-black text-gray-900">₹{order.totalPrice}</span>
                        </div>
                        
                        {order.orderStatus === "Ready" && (
                             <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter animate-pulse border border-orange-100">
                                Token: {order.token}
                             </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
