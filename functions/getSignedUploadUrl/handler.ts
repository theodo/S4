import { S3 } from "aws-sdk";
import createHttpError from "http-errors";
import { FromSchema } from "json-schema-to-ts";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import jsonValidator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";

import { getFileSizeLimit } from "./fileFormatRestrictions";
import FileUploadToken from "../../libs/FileUploadTokenEntity";
import inputSchema from "./schema";

const S3Client = new S3({ signatureVersion: "v4" });

const getSignedUploadUrl = async ({
  queryStringParameters,
}: FromSchema<typeof inputSchema>) => {
  const { uploadToken, fileType } = queryStringParameters;
  const { Item } = await FileUploadToken.get(
    {
      pk: FileUploadToken.name,
      uploadToken,
    },
    { consistent: true }
  );

  const fileSizeLimit = getFileSizeLimit(fileType);

  if (fileSizeLimit === 0) {
    throw new createHttpError.BadRequest();
  }

  if (!Item) {
    throw new createHttpError.Forbidden();
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
          { "Content-Type": fileType },
        ],
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

const middyfiedHandler = middy(getSignedUploadUrl);
middyfiedHandler.use(jsonBodyParser());
middyfiedHandler.use(jsonValidator({ inputSchema }));
middyfiedHandler.use(httpErrorHandler());

export const main = middyfiedHandler;
