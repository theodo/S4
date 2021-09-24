export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        filePrefix: { type: "string" },
        fileName: { type: "string" },
        name: { type: "string" },
      },
      required: ["filePrefix", "fileName", "name"],
    },
  },
  required: ["queryStringParameters"],
} as const;
