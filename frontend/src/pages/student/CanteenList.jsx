// src/pages/student/CanteenList.jsx
import { useState, useEffect } from 'react';
import CanteenCard from '../../components/CanteenCard';
import { getAllCanteens, getAllItems } from '../../services/api';

function CanteenList({ searchQuery }) {
  const [canteens, setCanteens] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [canteenData, itemData] = await Promise.all([
                getAllCanteens(),
                getAllItems()
            ]);
            setCanteens(canteenData);
            setItems(itemData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredCanteens = canteens.filter(canteen => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // 1. Search by canteen name
    const matchName = canteen.name.toLowerCase().includes(query);
    
    // 2. Search by location
    const matchLocation = canteen.place.toLowerCase().includes(query);
    
    // 3. Search by food items inside canteen
    const matchingItems = items.filter(item => 
        item.canteen === canteen._id && 
        item.name.toLowerCase().includes(query)
    );
    const matchFood = matchingItems.length > 0;

    return matchName || matchLocation || matchFood;
  });

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium tracking-wide">Finding best canteens...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-6 md:px-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Campus Dining
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover the best food across campus. Search for canteens, locations, or your favorite dishes.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Content Container */}
      <div className="w-full px-6 md:px-12 mt-8 pb-12">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 mb-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-10 bg-orange-500 rounded-full"></span>
                        {searchQuery ? `Results for "${searchQuery}"` : "Available Canteens"}
                    </h2>
                    {searchQuery && (
                        <p className="text-gray-500 mt-1">Found {filteredCanteens.length} canteens matching your search</p>
                    )}
                </div>
                {!searchQuery && (
                    <span className="bg-green-50 text-green-700 text-sm font-bold px-5 py-2.5 rounded-2xl uppercase tracking-wider border border-green-100 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {canteens.length} Canteens Active
                    </span>
                )}
            </div>

            {/* Grid Layout */}
            {filteredCanteens.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                    {filteredCanteens.map((canteen) => (
                        <CanteenCard key={canteen._id} canteen={canteen} />
                    ))}
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No canteens found</h3>
                    <p className="text-gray-500 max-w-sm">
                        We couldn't find any canteens matching "{searchQuery}". Try searching for something else!
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default CanteenList;