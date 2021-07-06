export const generateInvokePolicyDocument = (
  resource: string,
  effect: "Allow" | "Deny"
) => {
  return {
    principalId: "allowedUploader",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
