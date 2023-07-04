import instance from "./config";

const loanQueryApi = {
    getAll: (pageNo, limit, searchQuery) => instance.get(`/loan-query/getall?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    delete: (studentId) => instance.delete(`/loan-query/${studentId}`),
};

export default loanQueryApi;