// import AWS from '@q';
import { S3Client } from '@aws-sdk/client-s3';
import { XhrHttpHandler } from '@aws-sdk/xhr-http-handler';

const client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_S3_ACCESS_KEY,
        secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_KEY,
    },
    requestHandler: new XhrHttpHandler(),
});

export default client;