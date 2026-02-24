import { useState } from 'react';
import OwnerSidebar from '../../components/OwnerSidebar';
import { addCanteen } from '../../services/api'; 

function AddCanteen() {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    address: '',
    openingTime: '',
    closingTime: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await addCanteen(formData);
        if(response.success) {
            // Redirect to dashboard
            navigate('/owner/dashboard');
        } else {
            alert(response.message || 'Failed to add canteen');
        }
    } catch (error) {
        console.error("Error adding canteen:", error);
        alert("Something went wrong"); // Updated alert message
    }
  };

  return (
    <div className="flex gap-6">
      <OwnerSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Canteen</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canteen Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                        required 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                        <input 
                            type="text" 
                            name="college" 
                            value={formData.college} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                            required 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                            required 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                        <input 
                            type="time" 
                            name="openingTime" 
                            value={formData.openingTime} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                            required 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                        <input 
                            type="time" 
                            name="closingTime" 
                            value={formData.closingTime} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                            required 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input 
                        type="url" 
                        name="image" 
                        value={formData.image} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    Add Canteen
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default AddCanteen;