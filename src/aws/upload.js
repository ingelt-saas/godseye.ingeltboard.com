import client from "./config";
import { Upload } from "@aws-sdk/lib-storage";

const uploadToAWS = (file, filePath, uploadProgress) => new Promise(async (resolve, reject) => {
    try {

        let ext = file.type.split('/')[1];
        const fileName = `${Date.now()}.${ext}`;

        const params = {
            Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
            Key: `${filePath}/${fileName}`,
            Body: file,
            ContentType: file.type
        };

        const upload = new Upload({
            client: client,
            params: params
        });
        upload.on('httpUploadProgress', (e) => typeof uploadProgress === 'function' && uploadProgress(e));
        const result = await upload.done();
        resolve({ result, Key: `${filePath}/${fileName}` });

    } catch (err) {
        reject(err)
    }
});

export default uploadToAWS;
