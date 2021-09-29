export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        filePrefix: { type: "string" },
        fileName: { type: "string" },
      },
      required: ["filePrefix", "fileName"],
    },
  },
  required: ["queryStringParameters"],
} as const;
