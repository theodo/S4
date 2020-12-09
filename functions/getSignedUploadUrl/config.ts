export default {
  handler: "functions/getSignedUploadUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
  },
  events: [
    {
      httpApi: {
        method: "GET",
        path: "/api/get-signed-upload-url",
      },
    },
  ],
};
