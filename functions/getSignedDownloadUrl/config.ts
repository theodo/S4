export const getSignedDownloadUrl = {
  handler: "functions/getSignedDownloadUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
  },
  events: [
    {
      http: {
        method: "GET",
        path: "/api/download-url",
        authorizer: {
          name: "getDownloadUrlAuthorizer",
          type: "request",
          identitySource: "method.request.querystring.name",
        },
      },
    },
  ],
};
