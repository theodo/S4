import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

import FileUploadToken from "../../../../libs/FileUploadTokenEntity";

export const main: APIGatewayProxyHandlerV2<{ uploadToken: string }> = async (
  event
) => {
  const { name } = event.queryStringParameters;

  if (!name) {
    return { statusCode: 400 };
  }
  // Naive authentification strategy
  // all requests with a queryStringParameter "name" containing the "allowMe" string are accepted
  if (!name.includes("allowMe")) {
    return { statusCode: 403 };
  }

  const uploadToken = uuidv4();

  await FileUploadToken.put({
    pk: "FileUploadToken",
    uploadToken,
    // specify file uploaded event sent as detail type in event bridge
    ressourceName: "TEST",
    // you can put any other information you wish about the file you uploaded
    // this information could be use to display a list of uploaded files
  });

  return { uploadToken };
};
