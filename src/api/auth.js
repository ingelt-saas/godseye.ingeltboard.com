import Cookies from 'js-cookie';
import instance from './config';

const authApi = {
    login: (email, password) => instance.post('/login', { email, password }),
    verifyInGelt: () => instance.get('/verify-ingelt', { headers: { 'Authorization': `Bearer ${Cookies.get('ingelt_token')}` } }),
    updateInGelt: (data) => instance.put(`/update-ingelt`, data),

    resetPasswordEmail: (email) => instance.post('/auth/resetEmail', { email }),
    updatePassword: (token, password) => instance.post('/auth/passwordUpdate', { token, password })
};

export default authApi;