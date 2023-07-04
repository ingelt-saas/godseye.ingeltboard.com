import instance from "./config";

const visaQueryApi = {
    getAll: (pageNo, limit, searchQuery) => instance.get(`/visa-query/getall?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    delete: (studentId) => instance.delete(studentId),
};

export default visaQueryApi;