import instance from './config';

const universityApi = {
    create: (data) => instance.post(`/university`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    read: (pageNo, limit, searchQuery) => instance.get(`/university/getall?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    readById: (universityId) => instance.get(`/university/${universityId}`),
    update: (universityId, data) => instance.put(`/university/${universityId}`, data),
    delete: (universityId) => instance.delete(`/university/${universityId}`),
    studentsShortlist: (pageNo, limit, searchQuery) => instance.get(`/university/studentsShortlist/?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
};

export default universityApi;