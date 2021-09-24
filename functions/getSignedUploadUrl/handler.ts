import { S3 } from "aws-sdk";
import createHttpError from "http-errors";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import jsonValidator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { v4 as uuidv4 } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";

import { getFileSizeLimit } from "./fileFormatRestrictions";
import inputSchema from "./schema";

const S3Client = new S3({ signatureVersion: "v4" });

const getSignedUploadUrl: APIGatewayProxyHandler = async ({
  queryStringParameters,
}) => {
  const { fileType } = queryStringParameters;

  const fileSizeLimit = getFileSizeLimit(fileType);

  if (fileSizeLimit === 0) {
    throw new createHttpError.BadRequest();
  }

  const filePrefix = uuidv4();

  const urlAndS3Fields: { url: string; fields: Record<string, string> } =
    await new Promise((resolve, reject) => {
      S3Client.createPresignedPost(
        {
          Bucket: process.env.BUCKET_NAME,
          Fields: {
            "x-amz-storage-class": "INTELLIGENT_TIERING",
          },
          Expires: 300,
          Conditions: [
            ["starts-with", "$key", `${filePrefix}/`],
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

  return {
    statusCode: 200,
    body: JSON.stringify({ ...urlAndS3Fields, filePrefix }),
  };
};

const middyfiedHandler = middy(getSignedUploadUrl);
middyfiedHandler.use(jsonBodyParser());
middyfiedHandler.use(jsonValidator({ inputSchema }));
middyfiedHandler.use(httpErrorHandler());

export const main = middyfiedHandler;
