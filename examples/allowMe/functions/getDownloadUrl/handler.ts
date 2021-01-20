import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import LambdaClient from "aws-sdk/clients/lambda";

import { File } from "../../libs/File";

const lambda = new LambdaClient();

export const main: APIGatewayProxyHandlerV2<{ downloadUrl: string }> = async (
  event
) => {
  const { fileId, name } = event.queryStringParameters;

  if (!name.includes("allowMe")) {
    return { statusCode: 403 };
  }

  console.log(fileId);

  const { Item: file } = await File.get({ pk: "File", filePrefix: fileId });

  if (!file) {
    return { statusCode: 404 };
  }

  const { FunctionError, Payload: data } = await lambda
    .invoke({
      FunctionName: process.env.GET_DOWNLOAD_URL_LAMBDA_ARN,
      Payload: JSON.stringify({
        filePrefix: fileId,
        fileName: file.fileName,
      }),
    })
    .promise();

  if (FunctionError || !data) {
    throw new Error(JSON.parse(data as string).errorMessage);
  }
  const { downloadUrl } = JSON.parse(data as string);

  return { downloadUrl };
};
