import { APIGatewayRequestAuthorizerHandler } from "aws-lambda";

import { generateInvokePolicyDocument } from "../../../../utils/authorizerUtils";

export const main: APIGatewayRequestAuthorizerHandler = async (event) => {
  const { Authorization: token } = event.headers;

  // Naive authentification strategy
  // all requests with a "token" containing the "allowMeToDownload" string are accepted
  if (!token?.includes("allowMeToDownload")) {
    return generateInvokePolicyDocument(event.methodArn, "Deny");
  }

  return generateInvokePolicyDocument(event.methodArn, "Allow");
};
