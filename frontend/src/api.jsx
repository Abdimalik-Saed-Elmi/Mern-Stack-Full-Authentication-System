import axios from "axios";

const API  = axios.create({
    baseURL: "http://localhost:5000/api/auth"
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorazition = `Bearer ${token}`;
    return req;
})

export default API