import instance from './config';

const blogsApi = {
    create: (data) => instance.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    readAll: (pageNo, limit, searchQuery) => instance.post(`/blogs/getall?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    readById: (blogId) => instance.get(`/blogs/${blogId}`),
    update: (blogId, data) => instance.put(`/blogs/${blogId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (blogId) => instance.delete(`/blogs/${blogId}`),
};

export default blogsApi;