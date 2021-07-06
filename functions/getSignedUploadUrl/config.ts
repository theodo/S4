export const getSignedUploadUrl = {
  handler: "functions/getSignedUploadUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
  },
  events: [
    {
      http: {
        method: "GET",
        path: "/api/signed-upload-url",
        authorizer: {
          name: "getUploadUrlAuthorizer",
          type: "request",
          identitySource: "method.request.querystring.name",
        },
      },
    },
  ],
};
