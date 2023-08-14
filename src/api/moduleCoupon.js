import instance from "./config";

const moduleCouponApi = {
    create: (data) => instance.post(`/moduleCoupon`, data),
    getAll: () => instance.get(`/moduleCoupon/getall`),
    update: (couponId, data) => instance.put(`/moduleCoupon/${couponId}`, data),
    delete: (couponId) => instance.delete(`/moduleCoupon/${couponId}`),
};

export default moduleCouponApi;