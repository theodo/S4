export default {
  handler: "functions/dispatchFileUploadedEvent/handler.main",
  environment: {
    EVENT_BUS_NAME: "${self:custom.eventBusName}",
    COMMON_TABLE_NAME: "${self:custom.commonTableName}",
  },
  events: [
    {
      s3: {
        bucket: "${self:custom.bucketName}",
        event: "s3:ObjectCreated:*",
        existing: true,
      },
    },
  ],
};
