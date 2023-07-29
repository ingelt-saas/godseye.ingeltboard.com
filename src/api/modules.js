import instance from './config';

const modulesApi = {
    create: (data) => instance.post(`/modules`, data),
    read: (type, pageNo, limit, searchQuery) => instance.get(`/modules/getall?type=${type}&pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    update: (moduleId, data) => instance.put(`/modules/${moduleId}`, data),
    delete: (moduleId) => instance.delete(`/modules/${moduleId}`),
    readById: (moduleId) => instance.get(`/modules/${moduleId}`),
};

export default modulesApi;