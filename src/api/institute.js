import instance from './config';

const instituteApi = {
    create: (data) => instance.post(`/organization`, data, { headers: { "Content-Type": 'multipart/form-data' } }),
};

export default instituteApi;