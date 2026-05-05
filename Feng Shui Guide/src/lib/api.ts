import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // Handle relative paths from backend (e.g. "category/filename.jpg")
  const baseUrl = API_BASE_URL.replace("/api", "/uploads");
  return `${baseUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
};

// Products
export const getProducts = async (params?: any) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await api.get("/product-categories");
  return response.data;
};

// Articles
export const getArticles = async (params?: any) => {
  const response = await api.get("/articles", { params });
  return response.data;
};

export const getArticleBySlug = async (slug: string) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};

// Services
export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

// Gallery
export const getGallery = async (category?: string) => {
  const response = await api.get("/gallery", { params: { category } });
  return response.data;
};

export const getImagesByCategory = async (category: string) => {
  const response = await api.get(`/images/${category}`);
  return response.data;
};

// Orders
export const createOrder = async (orderData: any) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Chat AI
export const chatWithAI = async (message: string) => {
  const response = await api.post("/chat", { message });
  return response.data;
};

// Public content (FAQs, Testimonials, Jobs)
export const getFaqs = async () => {
  const response = await api.get("/faqs");
  return response.data;
};

export const getTestimonials = async () => {
  const response = await api.get("/testimonials");
  return response.data;
};

export const getJobs = async (params?: any) => {
  const response = await api.get("/jobs", { params });
  return response.data;
};

export const postBooking = async (bookingData: any) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const postJobApplication = async (applicationData: any) => {
  const response = await api.post("/job-applications", applicationData);
  return response.data;
};

export default api;
