import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/advertisers",
  withCredentials: true,
});

export const fetchAdvertisers = () => API.get("/");
export const fetchAdvertiser = (id) => API.get(`/${id}`);
export const createAdvertiser = (data) => API.post("/", data);
export const updateAdvertiser = (id, data) => API.put(`/${id}`, data);
export const deleteAdvertiser = (id) => API.delete(`/${id}`);
