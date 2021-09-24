import { APIGatewayRequestAuthorizerHandler } from "aws-lambda";

import { generateInvokePolicyDocument } from "../../../../utils/authorizerUtils";

export const main: APIGatewayRequestAuthorizerHandler = async (event) => {
  const { name } = event.queryStringParameters;

  // Naive authentification strategy
  // all requests with a queryStringParameter "name" containing the "allowMeToUpload" string are accepted
  if (!name || !name.includes("allowMeToUpload")) {
    return generateInvokePolicyDocument(event.methodArn, "Deny");
  }

  return generateInvokePolicyDocument(event.methodArn, "Allow");
};
