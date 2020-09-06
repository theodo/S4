import { S3 } from "aws-sdk";
import { Forbidden, BadRequest } from "http-errors";

import { getFileSizeLimit } from "./fileFormatRestrictions";
import FileUploadToken from "../../libs/FileUploadTokenEntity";

const S3Client = new S3({ signatureVersion: "v4" });

const getSignedUrl = async ({ queryStringParameters }) => {
  const { uploadToken, filetype } = queryStringParameters;
  const { Item } = await FileUploadToken.get(
    {
      pk: FileUploadToken.name,
      sk: uploadToken,
    },
    { consistent: true }
  );

  const fileSizeLimit = getFileSizeLimit(filetype);

  if (fileSizeLimit === 0) {
    throw new BadRequest();
  }

  if (!Item) {
    throw new Forbidden();
  }

  return await new Promise((resolve, reject) => {
    S3Client.createPresignedPost(
      {
        Bucket: process.env.BUCKET_NAME,
        Fields: {
          "x-amz-storage-class": "INTELLIGENT_TIERING",
        },
        Expires: 300,
        Conditions: [
          ["starts-with", "$key", `${uploadToken}/`],
          ["content-length-range", 10, fileSizeLimit],
          { "Content-Type": filetype },
        ],
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

export const main = getSignedUrl;
