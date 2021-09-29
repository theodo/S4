export const getSignedUploadUrl = {
  handler: "functions/getSignedUploadUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
    FILE_TABLE_NAME: "${self:custom.fileTableName}",
  },
  events: [
    {
      http: {
        method: "GET",
        path: "/api/signed-upload-url",
        authorizer: {
          name: "getUploadUrlAuthorizer",
          type: "request",
          identitySource: "method.request.header.Authorization",
        },
      },
    },
  ],
};
