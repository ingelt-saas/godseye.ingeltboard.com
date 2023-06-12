import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/ingelt',
    headers: {
        Authorization: `Bearer ${Cookies.get('ingelt_token')}`
    }
});

export default instance;