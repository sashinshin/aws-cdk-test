import { S3 } from "aws-sdk";

export const handler = async (data: unknown): Promise<S3.Types.PutObjectRequest> => {
    console.log(data);
    const param: S3.Types.PutObjectRequest = {
        Bucket: "bucket name",
        Key: "filename",
        Body: "body",
        ContentType: "application/json"
    }

    return param;

}