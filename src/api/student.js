import instance from "./config";

const studentApi = {
    appliedStudents: (pageNo, limit, searchQuery) => instance.get(`/student/appliedStudents?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    acceptStudent: (id) => instance.put(`/student/acceptStudent/${id}`),
}
export default studentApi;