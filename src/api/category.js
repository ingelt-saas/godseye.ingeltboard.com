import instance from "./config";

const categoryApi = {
    create: (data) => instance.post(`/category`, data),
    read: () => instance.get(`/category/getall`),
    update: (categoryId, data) => instance.put(`/category/${categoryId}`, data),
    delete: (categoryId) => instance.delete(`/category/${categoryId}`),
};

export default categoryApi;