import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/publishers",
  withCredentials: true,
});

export const fetchPublishers = () => API.get("/");
export const fetchPublisher = (id) => API.get(`/${id}`);
export const createPublisher = (data) => API.post("/", data);
export const updatePublisher = (id, data) => API.put(`/${id}`, data);
export const deletePublisher = (id) => API.delete(`/${id}`);
