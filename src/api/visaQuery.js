import instance from "./config";

const visaQueryApi = {
    getAll: (pageNo, limit, searchQuery) => instance.get(`/visa-query/getall?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    delete: (visaQueryId) => instance.delete(`/visa-query/${visaQueryId}`),
};

export default visaQueryApi;