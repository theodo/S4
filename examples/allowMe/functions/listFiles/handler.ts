import { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { File } from "../../libs/File";
import { UploadedFile } from "../../libs/types";

export const main: APIGatewayProxyHandlerV2<{ files: UploadedFile[] }> = async (
  event
) => {
  const { name } = event.queryStringParameters;

  if (!name.includes("allowMe")) {
    return { statusCode: 403 };
  }

  const { Items: files } = await File.query(File.name);

  return { files };
};
