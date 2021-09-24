export const onFileUploaded = {
  handler: "examples/allowMe/functions/onFileUploaded/handler.main",
  environment: {
    FILE_TABLE_NAME: "${self:custom.fileTableName}",
  },
  events: [
    {
      eventBridge: {
        eventBus: "${self:custom.eventBridgeArn}",
        pattern: {
          source: ["s4-events"],
          "detail-type": ["FILE_UPLOADED"],
        },
      },
    },
  ],
};
