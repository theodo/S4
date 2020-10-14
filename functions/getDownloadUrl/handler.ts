import "source-map-support/register";
import { S3 } from "aws-sdk";

const S3Client = new S3({ signatureVersion: "v4" });

const getDownloadUrl = async ({
  filePrefix,
  filename,
}: {
  filePrefix: string;
  filename: string;
}): Promise<{ downloadUrl: string }> => {
  return {
    downloadUrl: await S3Client.getSignedUrlPromise("getObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: `${filePrefix}/${filename}`,
    }),
  };
};

export const main = getDownloadUrl;
