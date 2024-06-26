import instance from "./config";

const studentApi = {
    appliedStudents: (pageNo, limit, searchQuery) => instance.get(`/student/appliedStudents?pageNo=${pageNo}&limit=${limit}&s=${searchQuery}`),
    acceptStudent: (id) => instance.put(`/student/acceptStudent/${id}`),
    getStudents: (pageNo, limit, filter, searchQuery) => instance.get(`/student/getall?pageNo=${pageNo}&limit=${limit}&filter=${filter}&s=${searchQuery}`),
    getStudentsById: (data) => instance.post(`/student/onlineStudents`, data),
    delete: (studentId) => instance.delete(`/student/${studentId}`),
    searchStudents: (searchQuery) => instance.get(`/student/searchStudents?s=${searchQuery}`)
}
export default studentApi;