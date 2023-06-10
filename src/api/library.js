import instance from './config';

const libraryApi = {
    create: (data) => instance.post(`/library`, data, { headers: { "Content-Type": 'multipart/form-data' } }),
    read: (subject, pageNo, limit, searchQuery) => instance.get(`/library/getall?subject=${subject}&pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    update: (itemId, data) => instance.put(`/library/${itemId}`, data, { headers: { "Content-Type": 'multipart/form-data' } }),
    delete: (itemId) => instance.delete(`/library/${itemId}`),
};

export default libraryApi;