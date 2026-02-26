import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


export const loginUser = async (email, password, role) => {
  try {
    const { data } = await api.post("/auth/login", { email, password, role });

    return {
      success: true,
      token: data.token,
      name: data.name,
      role: data.role,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

export const signupUser = async (userData) => {
  try {
    const { data } = await api.post("/auth/signup", userData);

    return {
      success: true,
      token: data.token,
      name: data.name,
      role: data.role,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Signup failed",
    };
  }
};


export const getAllCanteens = async () => {
  try {
    const { data } = await api.get('/canteens');
    return data;
  } catch (error) {
    console.error("Error fetching canteens:", error);
    return [];
  }
};

export const getMyCanteen = async () => {
  try {
    const { data } = await api.get('/canteens/my');
    return data;
  } catch (error) {
    console.error("Error fetching my canteen:", error);
    return null;
  }
}

export const addCanteen = async (canteenData) => {
  try {
    const { data } = await api.post('/canteens', canteenData);
    return { success: true, canteen: data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to add canteen' };
  }
};


export const getItemsByCanteen = async (canteenId) => {
  try {
    const { data } = await api.get(`/items/${canteenId}`);
    return data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

export const getAllItems = async () => {
  try {
    const { data } = await api.get('/items');
    return data;
  } catch (error) {
    console.error("Error fetching all items:", error);
    return [];
  }
};

export const addItem = async (itemData) => {
  try {
    const { data } = await api.post('/items', itemData);
    return { success: true, item: data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to add item' };
  }
};

export const deleteItem = async (itemId) => {
  try {
    await api.delete(`/items/${itemId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete item' };
  }
}

export const updateItemStatus = async (itemId, available) => {
  try {
    const { data } = await api.put(`/items/${itemId}`, { available });
    return { success: true, item: data };
  } catch (error) {
    return { success: false, message: 'Failed to update item' };
  }
}


export const placeOrder = async (orderData) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, message: error.response?.data?.message || 'Failed to place order' };
  }
};

export const getMyOrders = async () => {
  try {
    const { data } = await api.get('/orders/my');
    return data;
  } catch (error) {
    console.error("Error fetching my orders:", error);
    return [];
  }
}



export const getOwnerOrders = async (canteenId) => {
  try {
    if (!canteenId) {
      const canteen = await getMyCanteen();
      if (canteen) canteenId = canteen._id;
      else return [];
    }

    const { data } = await api.get(`/orders/canteen/${canteenId}`);
    return data;
  } catch (error) {
    console.error("Error fetching owner orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data } = await api.put(`/orders/${orderId}/order-status`, { status });
    return { success: true, order: data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update order status' };
  }
};

export const updatePaymentStatus = async (orderId, status) => {
  try {
    const { data } = await api.put(`/orders/${orderId}/payment-status`, { status });
    return { success: true, order: data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update payment status' };
  }
};

export const deleteAllOrders = async () => {
  try {
    const { data } = await api.delete('/orders/clear');

    return {
      success: true,
      message: data.message
    };

  } catch (error) {
    console.error("DELETE ERROR:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Delete failed"
    };
  }
};