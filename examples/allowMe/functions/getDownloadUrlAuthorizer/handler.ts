import { APIGatewayRequestAuthorizerHandler } from "aws-lambda";
import { generateInvokePolicyDocument } from "../../../../utils/authorizerUtils";

import { File } from "../../libs/File";

export const main: APIGatewayRequestAuthorizerHandler = async (event) => {
  const { fileId, name } = event.queryStringParameters;

  if (!name.includes("allowMe")) {
    return generateInvokePolicyDocument(
      process.env.GET_DOWNLOAD_URL_LAMBDA_ARN,
      "Deny"
    );
  }

  const { Item: file } = await File.get({ pk: "File", filePrefix: fileId });

  if (!file) {
    return generateInvokePolicyDocument(
      process.env.GET_DOWNLOAD_URL_LAMBDA_ARN,
      "Deny"
    );
  }

  return generateInvokePolicyDocument(
    process.env.GET_DOWNLOAD_URL_LAMBDA_ARN,
    "Allow"
  );
};
