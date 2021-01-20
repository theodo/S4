export const onFileUploaded = {
  handler: "examples/allowMe/functions/onFileUploaded/handler.main",
  environment: {
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
  },
  events: [
    {
      eventBridge: {
        eventBus: "${self:custom.eventBridgeArn}",
        pattern: {
          source: ["s4-events"],
          "detail-type": ["TEST_FILE_UPLOADED"],
        },
      },
    },
  ],
};
