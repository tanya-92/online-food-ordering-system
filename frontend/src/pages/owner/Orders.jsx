import React, { useState, useEffect } from 'react';
import { getOwnerOrders, deleteAllOrders, updateOrderStatus, updatePaymentStatus } from '../../services/api';
import OwnerSidebar from '../../components/OwnerSidebar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling for realtime updates
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
      try {
          const data = await getOwnerOrders();
          setOrders(data);
      } catch (error) {
          console.error("Failed to fetch orders:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all orders?")) {
        try {
            const res = await deleteAllOrders();
            if (res.success) {
                fetchOrders();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Delete all failed:", error);
            alert("Failed to delete all orders");
        }
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
        const res = await updateOrderStatus(orderId, status);
        if (res.success) {
            fetchOrders();
        } else {
            alert(res.message);
        }
    } catch (error) {
        console.error("Status update failed:", error);
    }
  };

  const handlePaymentUpdate = async (orderId, status) => {
    try {
        const res = await updatePaymentStatus(orderId, status);
        if (res.success) {
            fetchOrders();
        } else {
            alert(res.message);
        }
    } catch (error) {
        console.error("Payment update failed:", error);
    }
  };

  if (loading) {
// ... loading same ...
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <div className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Live Orders</h1>
                    <p className="text-gray-500 mt-2 font-medium opacity-80">Track and manage incoming orders in real-time.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                    <button 
                        onClick={handleDeleteAll}
                        className="w-full md:w-auto bg-red-600 hover:bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete All Orders
                    </button>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none bg-white/70 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-white flex items-center justify-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{orders.filter(o => o.orderStatus === 'Preparing').length} Preparing</span>
                        </div>
                        <div className="flex-1 md:flex-none bg-white/70 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-white flex items-center justify-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{orders.filter(o => o.orderStatus === 'Ready').length} Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Token ID</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items Ordered</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-8">
                                        <span className="font-mono font-black text-xl text-gray-900 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                                            #{order.token}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                                                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                                    {item.name} 
                                                    {item.quantity > 1 && <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded ml-2">x{item.quantity}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="font-black text-gray-900 text-xl">₹{order.totalPrice}</span>
                                    </td>
                                    <td className="p-8">
                                        <select value={order.paymentStatus} disabled={order.paymentStatus === "Paid"}   
                                            onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                                            className={`outline-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border appearance-none ${
                                                order.paymentStatus === 'Paid'
                                                    ? 'bg-green-50 text-green-700 border-green-100'  
                                                    : order.paymentStatus === 'Pending'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <select value={order.orderStatus} disabled={order.orderStatus === "Completed" || order.orderStatus === "Cancelled"}   // 🔥 lock after final state
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`outline-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border appearance-none ${
                                                    order.orderStatus === 'Preparing' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                                                    order.orderStatus === 'Ready' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                                    order.orderStatus === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                    order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 
                                                    'bg-gray-100 text-gray-400 border-gray-200'
                                                }`}>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Ready">Ready</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order._id} className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xl border border-white group">
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-mono font-black text-2xl text-gray-900 bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
                                    #{order.token}
                                </span>
                                <div className="flex flex-col gap-2 items-end">
                                    <select
                                        value={order.paymentStatus}
                                        onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                                        className={`outline-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border appearance-none cursor-pointer ${
                                            order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                        }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className={`outline-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border appearance-none cursor-pointer ${
                                            order.orderStatus === 'Preparing' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                                            order.orderStatus === 'Ready' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                            order.orderStatus === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                                            'bg-red-50 text-red-700 border-red-100'
                                        }`}
                                    >
                                        <option value="Preparing">Preparing</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8 px-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                            {item.name}
                                        </div>
                                        {item.quantity > 1 && <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-lg">x{item.quantity}</span>}
                                    </div>
                                ))}
                                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</span>
                                    <span className="text-2xl font-black text-gray-900">₹{order.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter">No Active Orders</h3>
                        <p className="text-gray-400 font-medium text-sm mt-1">Sit tight! New orders will be listed here.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;