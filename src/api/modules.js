import instance from './config';

const modulesApi = {
    create: (data) => instance.post(`/modules`, data),
    read: (subject, pageNo, limit, searchQuery) => instance.get(`/modules/getall?subject=${subject}&pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    update: (moduleId, data) => instance.put(`/modules/${moduleId}`, data),
    delete: (moduleId) => instance.delete(`/modules/${moduleId}`),
    readById: (moduleId) => instance.get(`/modules/${moduleId}`),
};

export default modulesApi;