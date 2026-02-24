// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ cartCount = 0, user, setUser, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const userName = user?.name;
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsDrawerOpen(false);
    navigate("/");
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Canteens", path: "/student/canteens" },
    { label: "My Orders", path: "/student/orders" }, // Assuming this exists or will be needed
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* 1. Hamburger Menu (Mobile Only) */}
            <div className="flex md:hidden mr-2">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* 2. Logo Section */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="hidden lg:block tracking-tight">Smart Canteen</span>
              </Link>
            </div>

            {/* 3. Search Bar (Centered) - STUDENT ONLY */}
            {userRole !== "owner" && (
              <div className="flex-1 max-w-xl mx-4 md:mx-8">
                <form className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-2.5 md:py-3 border border-gray-200/80 rounded-2xl leading-5 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm shadow-inner"
                    placeholder="Search food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
            )}

            {/* 4. Right Actions */}
            <div className="flex items-center gap-2 md:gap-6">
              {/* Cart Icon */}
              {userRole !== "owner" && (
                <Link to="/student/cart" className="relative p-2.5 text-gray-500 hover:text-orange-600 transition-colors rounded-xl hover:bg-orange-50 group">
                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && <span className="absolute 0 -right-1 w-5 h-5 text-xs bg-red-600 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>}
                </Link>
              )}

              {/* Profile / Login (Desktop) */}
              <div className="hidden md:flex items-center">
                {userName ? (
                  <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                    <div className="text-right hidden xl:block">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{userName}</p>
                      <p className="text-xs text-gray-500 capitalize">{userRole === "owner" ? "Owner" : "Student"}</p>
                    </div>
                    <div className="group relative cursor-pointer">
                      <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold border-[3px] border-white shadow-md group-hover:shadow-lg group-hover:border-orange-100 transition-all overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`} alt={userName} className="w-full h-full object-cover" />
                      </div>
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 border border-gray-100 translate-y-2 group-hover:translate-y-0">
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/login")} className="text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER OVERLAY */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out transform md:hidden ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
               </div>
               <span className="font-extrabold text-xl tracking-tighter">Foodle</span>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full bg-gray-50 text-gray-500 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Section (Mobile) */}
          {userName && (
            <div className="p-6 bg-gray-50/50 border-b border-gray-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-white">
                     <img src={`https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`} alt={userName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{userName}</h3>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{userRole}</p>
                  </div>
               </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {userRole !== 'owner' ? (
              <>
                <Link to="/" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Home
                </Link>
                <Link to="/student/canteens" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Browse Canteens
                </Link>
                <Link to="/student/cart" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  My Cart
                </Link>
              </>
            ) : (
              <>
                <Link to="/owner/dashboard" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  Dashboard
                </Link>
                <Link to="/owner/add-menu" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  Manage Menu
                </Link>
                <Link to="/owner/orders" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  Live Orders
                </Link>
              </>
            )}
          </div>

          {/* Footer (Drawer) */}
          <div className="p-4 border-t border-gray-100">
            {userName ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => {navigate("/login"); setIsDrawerOpen(false);}} className="py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 shadow-sm">Login</button>
                 <button onClick={() => {navigate("/signup"); setIsDrawerOpen(false);}} className="py-3 px-4 rounded-xl font-bold text-white bg-gray-900 shadow-md">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
