// src/pages/owner/OwnerDashboard.jsx
import { useState, useEffect } from 'react';
import OwnerSidebar from '../../components/OwnerSidebar';
import { getMyCanteen, getOwnerOrders, addCanteen } from '../../services/api';

const OwnerDashboard = () => {
  const [canteen, setCanteen] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', place: '', openingTime: '', closingTime: '', image: '' });
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
        const myCanteen = await getMyCanteen();
        if (myCanteen) {
            setCanteen(myCanteen);
            // Fetch orders to calculate stats
            const orders = await getOwnerOrders();
            setOrders(orders);
            const pending = orders.filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Ready').length;
            const revenue = orders.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);
            setStats({
                totalOrders: orders.length,
                pendingOrders: pending,
                revenue: revenue
            });
        }
    } catch (error) {
        console.error("Dashboard error:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    // For now, since backend expects string URL and we don't have file upload API yet,
    // we will simulate the UI but send a default image or text input.
    // In a real app with file upload:
    const file = e.target.files[0];
    if (file) {
        setFilePreview(URL.createObjectURL(file));
        // We'll set a dummy URL if they upload a file so validation passes.
        setFormData({ ...formData, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" });
    }
  };

  const handleSubmitCanteen = async (e) => {
    e.preventDefault();
    const response = await addCanteen(formData);
    if (response.success) {
        setShowAddModal(false);
        fetchDashboardData();
    } else {
        alert("Error adding canteen: " + response.message);
    }
  };


  if (loading) return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* CONDITION 1: NO CANTEEN -> SHOW ADD CARD */}
        {!canteen ? (
            <div className="h-[80vh] flex flex-col items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Start Your Journey</h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        You haven't registered a canteen yet. Add your canteen details to start accepting orders from students.
                    </p>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all"
                    >
                        Add Your Canteen
                    </button>
                </div>
            </div>
        ) : (
            /* CONDITION 2: HAS CANTEEN -> SHOW DASHBOARD */
            <>
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 md:p-10 rounded-[2rem] mb-8 md:mb-10 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-orange-300 mb-3 border border-white/10">
                            {canteen.name}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tighter">Dashboard</h1>
                        <p className="text-gray-400 text-sm md:text-lg max-w-2xl font-medium opacity-80">
                            Managing <span className="text-white">{canteen.name}</span>. 
                            You have <span className="text-orange-400 font-bold">{stats.pendingOrders} active orders</span>.
                        </p>
                    </div>
                </div>

                {/* Real Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
                    {/* Total Orders */}
                    <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-sm border border-white flex items-center gap-6 group hover:shadow-xl transition-all duration-300">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Orders</p>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900">{stats.totalOrders}</h3>
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-sm border border-white flex items-center gap-6 group hover:shadow-xl transition-all duration-300">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending</p>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900">{stats.pendingOrders}</h3>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-sm border border-white flex items-center gap-6 group hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Revenue</p>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900">₹{stats.revenue}</h3>
                        </div>
                    </div>
                </div>

                {/* New Section: Status Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2">Preparing</span>
                        <h4 className="text-2xl font-black text-gray-900">{orders.filter(o => o.orderStatus === 'Preparing').length}</h4>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Ready</span>
                        <h4 className="text-2xl font-black text-gray-900">{orders.filter(o => o.orderStatus === 'Ready').length}</h4>
                    </div>
                    <div className="bg-green-50/50 border border-green-100 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Delivered</span>
                        <h4 className="text-2xl font-black text-gray-900">{orders.filter(o => o.orderStatus === 'Completed').length}</h4>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                    {/* Recent Orders List (Left Column) */}
                    <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Recent Orders</h2>
                            <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-gray-500">Live View</span>
                        </div>
                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-50 group hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono font-black text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">#{order.token}</span>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm line-clamp-1">{order.items.map(i => i.name).join(', ')}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">₹{order.totalPrice}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            order.orderStatus === 'Preparing' ? 'bg-orange-50 text-orange-600' :
                                            order.orderStatus === 'Ready' ? 'bg-blue-50 text-blue-600' :
                                            order.orderStatus === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-gray-400 font-medium italic">No recent orders</p>
                            )}
                        </div>
                    </div>

                    {/* Activity Feed (Right Column) */}
                    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-8">Recent Activity</h2>
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {orders.length > 0 ? (
                                orders.slice(0, 5).map((order, idx) => (
                                    <div key={idx} className="flex gap-4 relative">
                                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0 z-10 ${
                                            order.orderStatus === 'Completed' ? 'bg-green-500' :
                                            order.orderStatus === 'Preparing' ? 'bg-orange-500' : 'bg-blue-500'
                                        }`} />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Order #{order.token} {
                                                order.orderStatus === 'Completed' ? 'Delivered' : 
                                                order.orderStatus === 'Ready' ? 'is Ready' : 
                                                'Placed'
                                            }</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 font-medium italic py-4">No recent activity</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Revenue Analysis (Simple Chart) */}
                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white mb-10">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-8">Revenue Analysis</h2>
                    <div className="h-48 flex items-end gap-2 sm:gap-4 px-4 overflow-x-auto">
                        {orders.length > 0 ? (() => {
                            const last7Days = [...Array(7)].map((_, i) => {
                                const d = new Date();
                                d.setDate(d.getDate() - i);
                                return d.toISOString().split('T')[0];
                            }).reverse();

                            const dailyRevenue = last7Days.map(date => {
                                return orders
                                    .filter(o => o.createdAt && o.createdAt.split('T')[0] === date)
                                    .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
                            });

                            const maxRev = Math.max(...dailyRevenue) || 1;

                            return dailyRevenue.map((rev, i) => (
                                <div key={i} className="flex-1 min-w-[30px] flex flex-col items-center gap-3 group">
                                    <div className="w-full relative bg-gray-50 rounded-lg overflow-hidden h-32 flex items-end">
                                        <div 
                                            className="w-full bg-orange-400 group-hover:bg-orange-500 transition-all duration-500 rounded-t-sm" 
                                            style={{ height: `${(rev / maxRev) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                        {rev > 0 ? `₹${rev}` : '-'}
                                    </span>
                                </div>
                            ));
                        })() : <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium italic">Revenue data unavailable</div>}
                    </div>
                </div>
            </>
        )}

        {/* ADD CANTEEN MODAL */}
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Canteen Details</h2>
                        <button onClick={() => setShowAddModal(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmitCanteen} className="p-8">
                        <div className="space-y-6">
                            {/* File Upload UI */}
                            <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all relative overflow-hidden group">
                                {filePreview ? (
                                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">Click to upload canteen image</p>
                                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    </>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Canteen Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                                        placeholder="Fast Food Corner"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.place}
                                        onChange={(e) => setFormData({...formData, place: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                                        placeholder="Library Block"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Opening Time</label>
                                    <input 
                                        type="time" 
                                        value={formData.openingTime}
                                        onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Closing Time</label>
                                    <input 
                                        type="time" 
                                        value={formData.closingTime}
                                        onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button 
                                type="button" 
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
                            >
                                Create Canteen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default OwnerDashboard;