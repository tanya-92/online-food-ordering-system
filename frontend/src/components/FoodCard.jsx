// src/components/FoodCard.jsx
function FoodCard({ item, onAdd }) {
  // item = { id, name, price, image, category, available }
  const isAvailable = item.available !== false;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 ${!isAvailable ? "opacity-75 grayscale-[0.3]" : ""}`}>
      <div className="relative h-[220px] w-full overflow-hidden rounded-t-2xl">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isAvailable ? "group-hover:scale-105" : ""}`}
        />
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
          {item.category}
        </div>
        
        {!isAvailable && (
          <div className="absolute top-2 right-2 bg-red-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`text-lg font-bold text-gray-800 line-clamp-1 transition-colors ${isAvailable ? "group-hover:text-orange-600" : "text-gray-400"}`}>
            {item.name}
          </h3>
        </div>
        <div className="flex items-end justify-between mt-2">
             <span className={`text-xl font-black ${isAvailable ? "text-gray-900" : "text-gray-400"}`}>
                ₹{item.price}
            </span>
            
            <button
                disabled={!isAvailable}
                className={`p-2 rounded-lg transition-all duration-200 ${isAvailable ? "bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-800 active:scale-90" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                onClick={() => onAdd({
                  ...item,
                  id: item._id || item.id
                })}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;