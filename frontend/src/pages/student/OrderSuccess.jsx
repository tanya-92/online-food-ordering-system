// src/pages/student/OrderSuccess.jsx
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function OrderSuccess() {
  const location = useLocation();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (location.state && location.state.token) {
      setToken(location.state.token);
    }
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[70vh] bg-gray-50">
      
      {/* Ticket Card */}
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Ticket Header */}
        <div className="bg-orange-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Order Confirmed!</h1>
            <p className="text-orange-100 text-sm">Thank you for dining with us.</p>
        </div>

        {/* Ticket Body */}
        <div className="p-8 text-center bg-white relative">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Order Token</p>
            <div className="text-5xl font-black text-gray-800 tracking-wider mb-2">
                #{token || '....'}
            </div>
            <p className="text-orange-600 text-sm font-medium mb-6 animate-pulse">
                Preparing your food...
            </p>

            <div className="border-t border-dashed border-gray-200 my-6"></div>

            <div className="text-left space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                    <span>Estimated Wait</span>
                    <span className="font-bold text-gray-800">10-15 mins</span>
                </div>
                <div className="flex justify-between">
                    <span>Pickup At</span>
                    <span className="font-bold text-gray-800">Counter 1</span>
                </div>
            </div>
            
            {/* Cutout circles for ticket effect */}
            <div className="absolute -left-3 top-[-12px] w-6 h-6 bg-gray-50 rounded-full"></div>
            <div className="absolute -right-3 top-[-12px] w-6 h-6 bg-gray-50 rounded-full"></div>
        </div>

        {/* Ticket Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
             <Link
                to="/student/canteens"
                className="block w-full bg-black text-white font-bold py-3 rounded-xl text-center hover:bg-gray-800 transition-colors shadow-lg"
            >
                Order More Items
            </Link>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-sm">
        Please show this token at the counter.
      </p>
    </div>
  );
}

export default OrderSuccess;