import instance from './config';

const studentActivityApi = {
    getActiveStudents: (year, month) => instance.get(`/studentActivity/getStudentsActivity?year=${year}&month=${month}`),
    getStudentsByDate: (date) => instance.get(`/studentActivity/getStudentsByDate?date=${date}`),
    getActivitiesByStudentId: (studentId, year, month) => instance.get(`/studentActivity/getActivities/${studentId}?year=${year}&month=${month}`),
};

export default studentActivityApi;