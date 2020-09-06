export default {
  handler: "functions/getDownloadUrl/handler.main",
  environment: {
    BUCKET_NAME: "${self:custom.bucketName}",
  },
};
