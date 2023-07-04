import instance from "./config";

const discussionApi = {
    getAll: (pageNo, limit) => instance.get(`/discussion/getall?pageNo=${pageNo}&limit=${limit}`),
};

export default discussionApi;