import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../services/api";

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      

      let response;
      if (isLogin) {
        response = await loginUser(formData.email, formData.password, "student"); 
      } else {
        response = await signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        });
      }

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userRole", response.role);
        localStorage.setItem("userName", response.name);

        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-up">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? "Welcome Back!" : "Create Account"}</h2>
            <p className="text-gray-500 text-sm">{isLogin ? "Login to continue ordering" : "Sign up to start your food journey"}</p>
          </div>

          {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="you@college.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-95">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-bold hover:underline">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
