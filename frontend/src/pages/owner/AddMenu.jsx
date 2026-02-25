// src/pages/owner/AddMenu.jsx
import { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { addItem, getMyCanteen } from "../../services/api";
import { getItemsByCanteen, deleteItem, updateItemStatus } from "../../services/api";

const AddMenu = () => {
  const [canteenId, setCanteenId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    const fetchCanteen = async () => {
      const canteen = await getMyCanteen();
      if (canteen) {
        setCanteenId(canteen._id);
        const menu = await getItemsByCanteen(canteen._id);
        setItems(menu);
      } else {
        alert("Please add a canteen first!");
      }
    };
    fetchCanteen();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    setFormData(prev => ({
      ...prev,
      image: reader.result
    }));
  };

  if (file) reader.readAsDataURL(file);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canteenId) {
      alert("No canteen found. Please add a canteen first.");
      return;
    }

    setLoading(true);
    try {
      const response = await addItem({ ...formData, canteenId });
      if (response.success) {
        alert("Menu Item Added");

        const updated = await getItemsByCanteen(canteenId);
        setItems(updated);

        setFormData({
          name: "",
          price: "",
          category: "",
          image: "",
          available: true,
        });
      } else {
        alert(response.message || "Failed to add item");
      }
    } catch (error) {
      console.error("Error adding menu:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <div className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Manage Menu</h1>
              <p className="text-gray-500 mt-2 font-medium opacity-80">Add or edit items in your digital menu.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* Form Section */}
            <div className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-white">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Item Title</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 md:py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-inner placeholder:text-gray-300"
                    placeholder="e.g. Classic Cheese Burger"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price</label>
                    <div className="relative">
                      <span className="absolute left-6 top-4 md:top-5 text-gray-400 font-black">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-10 pr-6 py-4 md:py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-black text-gray-900 shadow-inner"
                        placeholder="99"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-6 py-4 md:py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-inner appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Choose category...</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Meals">Meals</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                      <div className="absolute right-6 top-4 md:top-5 pointer-events-none text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Item Image</label>
                  <label className="block w-full cursor-pointer group">
                    <div className="flex flex-col items-center justify-center p-6 md:p-10 border-2 border-dashed border-gray-100 rounded-3xl group-hover:bg-orange-50 transition-colors">
                       <svg className="w-8 h-8 text-gray-300 group-hover:text-orange-500 mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       <p className="text-xs font-black text-gray-400 group-hover:text-orange-600 uppercase tracking-widest">Select Image File</p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <div className="mt-4 p-2 bg-white rounded-2xl border border-gray-100 inline-block">
                        <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded-xl" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                  <div
                    className="flex-1 flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors"
                    onClick={() => setFormData((prev) => ({ ...prev, available: !prev.available }))}
                  >
                    <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${formData.available ? "bg-green-500" : "bg-gray-300"}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.available ? "translate-x-5" : "translate-x-0"}`}></div>
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-gray-700">In Stock</span>
                    <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="hidden" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] w-full bg-gray-900 text-white font-black py-4 md:py-5 rounded-2xl hover:bg-black shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Publish Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* MENU ITEMS GRID */}
            <div className="mt-12">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Your Menu</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Live in store</p>
                </div>
              </div>

              {items.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No items found in your menu.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {items.map((item) => (
                  <div key={item._id} className="group bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white hover:border-orange-200 hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div className="relative h-[220px] overflow-hidden rounded-t-[16px]">
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 right-4">
                        <button 
                            onClick={async () => {
                                if (window.confirm("Delete item?")) {
                                    await deleteItem(item._id);
                                    const updated = await getItemsByCanteen(canteenId);
                                    setItems(updated);
                                }
                            }}
                            className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-black transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black shadow-sm">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-black text-gray-900 group-hover:text-orange-600 transition-colors mb-1">{item.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">{item.category}</p>

                      <button
                        onClick={async () => {
                          await updateItemStatus(item._id, !item.available);
                          const updated = await getItemsByCanteen(canteenId);
                          setItems(updated);
                        }}
                        className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 mt-auto border ${
                          item.available 
                          ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white" 
                          : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
                        }`}
                      >
                        {item.available ? "In Stock" : "Sold Out"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
