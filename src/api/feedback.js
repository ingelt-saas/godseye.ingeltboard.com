import instance from './config';

const feedbackApi = {
    create: (data) => instance.post(`/feedback`, data),
    getById: (feedbackId) => instance.get(`/feedback/getOne/${feedbackId}`),
    getAll: (page = 1, limit = 10, search = '') => instance.get(`/feedback/getAll?page=${page}&limit=${limit}&search=${search}`),
};

export default feedbackApi;