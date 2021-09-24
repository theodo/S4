export const listFiles = {
  handler: "examples/allowMe/functions/listFiles/handler.main",
  environment: {
    FILE_TABLE_NAME: "${self:custom.fileTableName}",
  },
  events: [
    {
      httpApi: {
        method: "GET",
        path: "/api/files",
      },
    },
  ],
};
