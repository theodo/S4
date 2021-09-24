import "source-map-support/register";
import { S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import jsonValidator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";

import { File } from "../../examples/allowMe/libs/File";
import inputSchema from "./schema";

const S3Client = new S3({ signatureVersion: "v4" });

const getSignedDownloadUrl: APIGatewayProxyHandler = async ({
  queryStringParameters,
}) => {
  const { filePrefix, fileName } = queryStringParameters;

  const { Item: file } = await File.get({ pk: "File", filePrefix });

  if (!file) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "File not found" }),
    };
  }

  const body = JSON.stringify({
    downloadUrl: await S3Client.getSignedUrlPromise("getObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: `${filePrefix}/${fileName}`,
    }),
  });

  return { statusCode: 200, body };
};

const middyfiedHandler = middy(getSignedDownloadUrl);
middyfiedHandler.use(jsonBodyParser());
middyfiedHandler.use(jsonValidator({ inputSchema }));
middyfiedHandler.use(httpErrorHandler());

export const main = middyfiedHandler;
