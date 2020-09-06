export default {
  handler: "functions/getSignedUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
    COMMON_TABLE_NAME: "${self:custom.commonTableName}",
  },
  events: [
    {
      httpApi: {
        method: "GET",
        path: "/api/get-signed-url",
      },
    },
  ],
};
