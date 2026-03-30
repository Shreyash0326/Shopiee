const API_URL = '/api';

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    console.error('Non-JSON response received:', text.substring(0, 200));
    throw new Error('Server returned an unexpected response (likely an error page). Check server logs.');
  }

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return handleResponse(res);
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(res);
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(res);
};

export const getCart = async () => {
  const res = await fetch(`${API_URL}/cart`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const removeFromCart = async (productId) => {
  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const placeOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
};

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders/my`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Admin API
export const getAllOrders = async () => {
  const res = await fetch(`${API_URL}/admin/orders`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};

export const createProduct = async (productData) => {
  const res = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

export const bulkCreateProducts = async (products) => {
  const res = await fetch(`${API_URL}/admin/products/bulk`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(products),
  });
  return handleResponse(res);
};

export const clearProducts = async () => {
  const res = await fetch(`${API_URL}/admin/products/clear`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const updateProduct = async (productId, productData) => {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

export const deleteProduct = async (productId) => {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};
