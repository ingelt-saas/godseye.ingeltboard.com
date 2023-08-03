import instance from "./config";

const mailApi = {
    sendSessionInvoice: (data) => instance.post('/sendMail/session-invoice', data)
};

export default mailApi;