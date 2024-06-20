import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:4050/",
    withCredentials: true,
});

export default instance;

