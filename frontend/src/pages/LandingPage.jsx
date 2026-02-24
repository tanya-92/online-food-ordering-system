import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 scale-110 animate-pulse-slow"
        style={{
          backgroundImage: "url('/burger_bg_1771869137261.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-br from-black/80 via-black/40 to-orange-900/40 backdrop-blur-[2px]" />
      
      {/* Floating Elements (Decorative) */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-12 md:mb-16 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-white">The Future of Campus Dining</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                SMART <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">CANTEEN</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
                Revolutionizing how you eat on campus. <br className="hidden md:block" />
                No queues. No waiting. Just pure flavor.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto items-stretch">
          {/* Student Card */}
          <button 
            onClick={() => {
              localStorage.setItem("loginRole", "student");
              navigate("/login");
            }} 
            className="group relative overflow-hidden p-8 md:p-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,107,0,0.3)] flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Student</h2>
                <p className="text-gray-400 font-medium group-hover:text-white transition-colors">Start your ordering journey</p>
            </div>
          </button>

          {/* Owner Card */}
          <button
            onClick={() => {
              localStorage.setItem("loginRole", "owner");
              navigate("/login");
            }}
            className="group relative overflow-hidden p-8 md:p-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:-rotate-12 transition-all duration-500 shadow-xl group-hover:text-black">
                  <svg className="w-12 h-12 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Owner</h2>
                <p className="text-gray-400 font-medium group-hover:text-white transition-colors">Manage your digital canteen</p>
            </div>
          </button>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col md:flex-row items-center justify-center gap-8 text-center animate-fade-in opacity-50">
           <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-white">50k+</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Daily <br /> Orders</span>
           </div>
           <div className="w-px h-10 bg-white/10 hidden md:block" />
           <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-white">4.9</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">User <br /> Rating</span>
           </div>
           <div className="w-px h-10 bg-white/10 hidden md:block" />
           <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-white">100%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Contactless <br /> Experience</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
