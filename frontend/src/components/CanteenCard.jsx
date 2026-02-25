import { useNavigate } from "react-router-dom";

function CanteenCard({ canteen }) {
  const navigate = useNavigate();
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = canteen.openingTime.split(":").map(Number);
  const [closeH, closeM] = canteen.closingTime.split(":").map(Number);

  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;

  let isOpen = false;

if (openTime < closeTime) {
  isOpen = current >= openTime && current <= closeTime;
} else {
  isOpen = current >= openTime || current <= closeTime;
}

  const handleCardClick = () => {
    if (isOpen) {
      navigate(`/student/canteens/${canteen._id}/menu`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 border border-white/50 
        ${isOpen 
          ? "hover:shadow-2xl hover:-translate-y-2 active:scale-95 cursor-pointer" 
          : "grayscale opacity-70 cursor-not-allowed shadow-none"
        }`}
    >
      {/* Image Container */}
      <div className="relative h-52 md:h-56 overflow-hidden">
        <img
          src={`${canteen.image}?q=80&w=800&auto=format&fit=crop`}
          alt={canteen.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${isOpen ? "group-hover:scale-110" : ""}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${isOpen ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`} />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border ${
            isOpen 
              ? "bg-green-500/80 text-white border-green-400/50" 
              : "bg-red-500/80 text-white border-red-400/50"
          }`}>
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Floating Time Info */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-500 ${isOpen ? "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" : "opacity-100 translate-y-0"}`}>
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex justify-between items-center text-white">
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Hours</span>
              <span className="text-xs font-black">{canteen.openingTime} - {canteen.closingTime}</span>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="mb-6">
            <h3 className={`text-2xl font-black text-gray-900 transition-colors tracking-tight ${isOpen ? "group-hover:text-orange-600" : ""}`}>
              {canteen.name}
            </h3>
            <p className="text-gray-500 text-sm font-bold flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {canteen.place}
            </p>
        </div>

        <div
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 
            ${isOpen 
              ? "bg-gray-900 text-white hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          View Menu
          <svg className={`w-4 h-4 transform transition-transform ${isOpen ? "group-hover:translate-x-1" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
export default CanteenCard;
