import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import FoodCard from "../../components/FoodCard";
import { getItemsByCanteen } from "../../services/api";
import { getAllCanteens } from "../../services/api";

const MenuPage = ({ addToCart, cart }) => {
  const { canteenId } = useParams();
  const navigate = useNavigate();
  const [canteenInfo, setCanteenInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/student/canteens");
    }
  };

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = canteenInfo?.openingTime?.split(":").map(Number) || [0,0];
  const [closeH, closeM] = canteenInfo?.closingTime?.split(":").map(Number) || [0,0];

  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;

  const isOpen = current >= openTime && current <= closeTime;

useEffect(() => {
  const fetchMenu = async () => {
    try {
      const items = await getItemsByCanteen(canteenId);

      const fixed = items.map(i => ({
        ...i,
        id: i._id
      }));

      setMenuItems(fixed);

      const all = await getAllCanteens();
      const found = all.find(c => c._id === canteenId);
      setCanteenInfo(found);

    } catch (error) {
      console.error("Failed:", error);
    }
  };

  if (canteenId) fetchMenu();
}, [canteenId]);

  const filteredItems = menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-24">
      <div className="relative h-64 md:h-96 bg-gray-900 overflow-hidden shadow-2xl">
        <img
          src={`${canteenInfo?.image}?q=80&w=1200&auto=format&fit=crop`} 
          className="w-full h-full object-cover opacity-60 transform scale-105"
          alt="Canteen Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent" />

        <div className="absolute top-0 left-0 w-fit p-4 md:p-6 z-30">
          <button
            onClick={handleBack}
            className="text-white/80 hover:text-white text-xs md:text-sm font-bold flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all hover:bg-black/40 border border-white/10 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 text-white z-20">
          
          <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-2xl">{canteenInfo?.name}</h1>
          <p className="text-gray-300 flex items-center gap-2 text-sm md:text-xl font-medium opacity-90">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {canteenInfo?.place}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12 relative z-30">
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12">
            {/* Category Tabs */}
            <div className="flex-1 bg-white/80 backdrop-blur-xl p-2 rounded-3xl shadow-xl flex gap-2 overflow-x-auto border border-gray-100 scrollbar-hide">
              {["All", "Snacks", "Meals", "Beverages"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl text-[13px] md:text-sm font-black whitespace-nowrap transition-all duration-300
                        ${activeCategory === cat ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20" : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Local Search Input */}
            <div className="w-full md:w-80 bg-white/80 backdrop-blur-xl p-2 rounded-3xl shadow-xl border border-gray-100 flex items-center">
                <div className="pl-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text"
                    placeholder="Search in menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 font-bold text-gray-700 placeholder-gray-400"
                />
            </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
          {filteredItems.map((item) => (
            <FoodCard key={item._id} item={item} onAdd={addToCart} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                {menuItems.length === 0 ? (
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
             </div>
            <h3 className="text-xl font-bold text-gray-900">
                {menuItems.length === 0 ? "Fetching tomorrow's specials..." : "No matches found"}
            </h3>
            <p className="text-gray-500 font-medium mt-1 px-4">
                {menuItems.length === 0 ? "Hang tight, we're loading the menu." : "Try adjusting your search or category filter!"}
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:bottom-10 md:right-10 z-50">
        <Link
          to="/student/cart"
          className="flex items-center justify-between md:justify-start gap-4 bg-gray-900 text-white px-6 md:px-8 py-4 md:py-5 rounded-[2rem] hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-orange-500/20 transform hover:-translate-y-1 active:scale-95 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-3 -right-3 bg-red-600 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-[3px] border-gray-900 shadow-lg">{cart?.length || 0}</span>
            </div>
            <div className="flex flex-col items-start -space-y-1">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order Summary</span>
              <span className="font-black text-lg">View Cart</span>
            </div>
          </div>
          <svg className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
