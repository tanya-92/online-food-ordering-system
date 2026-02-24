// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login({ setUser }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("loginRole");

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData.email, formData.password, role);

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userName", response.name);
        localStorage.setItem("userRole", response.role);

        // Update global state
        setUser({ name: response.name, role: response.role });

        if (response.role === "owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/student/canteens");
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fff4ee] overflow-hidden relative">
      {/* Decorative Background Shapes for Mobile/Tablet */}
      <div className="absolute top-0 left-0 w-full h-full lg:hidden overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-orange-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-orange-100 rounded-full blur-3xl"></div>
      </div>

      {/* LEFT SIDE: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-orange-200/50 border border-white/20 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-[#ff6b00] to-orange-400 p-3 rounded-2xl shadow-lg shadow-orange-200">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 17C18 15.3431 14.6569 14 12 14C9.34315 14 6 15.3431 6 17V19H18V17Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1f2937] tracking-tight">Foodle</h1>
            <p className="text-orange-500 font-medium text-sm mt-1 uppercase tracking-widest">Made with love ❤️</p>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-[#1f2937]">Login</h2>
              <p className="text-gray-500 mt-1">in as <span className="text-[#ff6b00] font-semibold">{role === 'owner' ? 'Admin' : 'Student'}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#ff6b00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter Email Id"
                className="w-full pl-12 pr-4 py-4 bg-orange-50/50 border border-transparent rounded-full text-[#1f2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] focus:bg-white transition-all duration-300"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#ff6b00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="Enter Password"
                className="w-full pl-12 pr-4 py-4 bg-orange-50/50 border border-transparent rounded-full text-[#1f2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] focus:bg-white transition-all duration-300"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#ff6b00] to-[#ff8c33] text-white font-bold rounded-full shadow-lg shadow-orange-300 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4"
            >
              Login
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#ff6b00] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#fff4ee] items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-orange-200/50 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#ff6b00] rounded-full opacity-10"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-300 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-[40px] border-orange-100 rounded-full opacity-50"></div>
        
        <div className="z-10 text-center max-w-sm">
          <div className="w-16 h-1 bg-[#ff6b00] mx-auto mb-6 rounded-full"></div>
          <h3 className="text-4xl font-black text-[#1f2937] leading-tight mb-4">
            Order Your <br />
            <span className="text-[#ff6b00]">Favorite Food</span>
          </h3>
          <p className="text-gray-500 text-lg">
            Delicious meals from your campus canteens, just a click away.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
