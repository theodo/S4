export const getSignedDownloadUrl = {
  handler: "functions/getSignedDownloadUrl/handler.main",
  environment: {
    FILE_TABLE_NAME: "${self:custom.fileTableName}",
    BUCKET_NAME: "${self:custom.bucketName}",
  },
  events: [
    {
      http: {
        method: "GET",
        path: "/api/signed-download-url",
        authorizer: {
          name: "getDownloadUrlAuthorizer",
          type: "request",
          identitySource: "method.request.querystring.name",
        },
      },
    },
  ],
};
