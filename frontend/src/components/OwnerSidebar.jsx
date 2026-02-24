import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const OwnerSidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const linkClass = (path) => `flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
        isActive(path) 
        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30" 
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
    }`;

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 md:hidden bg-gray-900 text-white p-4 rounded-2xl shadow-2xl active:scale-95 transition-transform"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed md:sticky top-0 md:top-20 left-0 bottom-0 z-[60] md:z-10 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-sm transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} flex flex-col h-full md:h-[calc(100vh-80px)]`}>
                <div className="p-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Owner Portal</h2>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Manage your canteen</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 rounded-full bg-gray-50 text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/owner/dashboard" onClick={() => setIsOpen(false)} className={linkClass('/owner/dashboard')}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link to="/owner/add-menu" onClick={() => setIsOpen(false)} className={linkClass('/owner/add-menu')}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Add Menu
                    </Link>

                    <Link to="/owner/orders" onClick={() => setIsOpen(false)} className={linkClass('/owner/orders')}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Orders
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white p-5 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span className="font-bold text-sm">Canteen Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OwnerSidebar;
