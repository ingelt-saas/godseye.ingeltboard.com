import instance from './config';

const sessionApi = {
    getAll: () => instance.get(`/session/getall`),
    update: (sessionId, data) => instance.put(`/session/${sessionId}`, data),
    delete: (sessionId) => instance.delete(`/session/${sessionId}`),
};

export default sessionApi;