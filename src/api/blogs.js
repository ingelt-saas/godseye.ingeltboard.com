import instance from './config';

const blogsApi = {
    create: (data) => instance.post('/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    readAll: (pageNo, limit, searchQuery) => instance.get(`/blog/getall?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    readById: (blogId) => instance.get(`/blog/${blogId}`),
    update: (blogId, data) => instance.put(`/blog/${blogId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (blogId) => instance.delete(`/blog/${blogId}`),
};

export default blogsApi;