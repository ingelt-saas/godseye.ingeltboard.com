import instance from './config';

const instituteApi = {
    create: (data) => instance.post(`/organization`, data, { headers: { "Content-Type": 'multipart/form-data' } }),
    read: (pageNo, limit, searchQuery) => instance.get(`/organization?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`,),
    delete: (orgId) => instance.delete(`/organization/${orgId}`),
};

export default instituteApi;