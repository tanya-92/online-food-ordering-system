// src/components/CartItem.jsx
function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg mb-4 border border-gray-100">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-orange-600 font-medium">₹{item.price}</p>
        </div>
      </div>
      
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;