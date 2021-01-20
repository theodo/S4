export const getSignedDownloadUrl = {
  handler: "functions/getSignedDownloadUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
  },
};
