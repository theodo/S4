export const dispatchFileUploadedEvent = {
  handler: "functions/dispatchFileUploadedEvent/handler.main",
  environment: {
    EVENT_BUS_NAME: "${self:custom.eventBusName}",
    FILE_TABLE_NAME: "${self:custom.fileTableName}",
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
