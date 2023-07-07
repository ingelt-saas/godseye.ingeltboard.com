import instance from './config';

const courseApi = {
    create: (data) => instance.post(`/course`, data),
    readById: (courseId) => instance.get(`/course/${courseId}`),
    getCourses: (pageNo, limit, universityId) => instance.get(`/course/getall?pageNo=${pageNo}&limit=${limit}&university=${universityId}`),
    update: (courseId, data) => instance.put(`/course/${courseId}`, data),
    delete: (courseId) => instance.delete(`/course/${courseId}`),
};

export default courseApi;