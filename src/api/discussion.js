import instance from "./config";

const discussionApi = {
    getAll: (pageNo, limit) => instance.get(`/discussion/getall?pageNo=${pageNo}&limit=${limit}`),
    getDiscussionReport: (discussionId) => instance.get(`/discussion/reports/${discussionId}`),
};

export default discussionApi;