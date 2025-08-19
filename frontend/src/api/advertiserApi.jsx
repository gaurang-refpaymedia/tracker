import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/advertisers", // your FastAPI backend
  withCredentials: true, // important if session-based auth
});

export const fetchAdvertisers = () => API.get("/");
export const fetchAdvertiser = (id) => API.get(`/${id}`);
export const createAdvertiser = (data) => API.post("/", data);
export const updateAdvertiser = (id, data) => API.put(`/${id}`, data);
export const deleteAdvertiser = (id) => API.delete(`/${id}`);
