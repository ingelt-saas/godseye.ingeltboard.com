import instance from './config';

const modulesApi = {
    create: (data, { uploadProgress }) => instance.post(`/modules`, data, {
        headers: { "Content-Type": 'multipart/form-data' },
        onUploadProgress: (e) => uploadProgress(e)
    }),
    read: (subject, pageNo, limit, searchQuery) => instance.get(`/modules/getall?subject=${subject}&pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    update: (moduleId, data, { uploadProgress }) => instance.put(`/modules/${moduleId}`, data, {
        headers: { "Content-Type": 'multipart/form-data' },
        onUploadProgress: (e) => uploadProgress(e)
    }),
    delete: (moduleId) => instance.delete(`/modules/${moduleId}`),
    readById: (moduleId) => instance.get(`/modules/${moduleId}`),
};

export default modulesApi;