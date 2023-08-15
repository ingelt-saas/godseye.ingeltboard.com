import instance from "./config";

const couponApi = {
    create: (data) => instance.post(`/coupon`, data),
    getAll: () => instance.get(`/coupon/getall`),
    update: (couponId, data) => instance.put(`/coupon/${couponId}`, data),
    delete: (couponId) => instance.delete(`/coupon/${couponId}`),
};

export default couponApi;