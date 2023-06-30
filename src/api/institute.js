import instance from './config';

const instituteApi = {
    create: (data) => instance.post(`/organization`, data),
    read: (pageNo, limit, searchQuery) => instance.get(`/organization?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`,),
    delete: (orgId) => instance.delete(`/organization/${orgId}`),
    update: (orgId, data) => instance.put(`/organization/${orgId}`, data),
    readById: (orgId) => instance.get(`/organization/${orgId}`),
};

export default instituteApi;