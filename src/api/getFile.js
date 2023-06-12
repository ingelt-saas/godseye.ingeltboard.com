import instance from "./config";

const getFile = (key) => instance.get(`/get-file`, { headers: { awskey: key } });

export default getFile;