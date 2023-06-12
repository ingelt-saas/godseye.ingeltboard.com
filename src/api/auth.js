import Cookies from 'js-cookie';
import instance from './config';

const authApi = {
    login: (email, password) => instance.post('/login', { email, password }),
    verifyInGelt: () => instance.get('/verify-ingelt', { headers: { 'Authorization': `Bearer ${Cookies.get('ingelt_token')}` } }),
};

export default authApi;