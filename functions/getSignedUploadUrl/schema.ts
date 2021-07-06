export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        fileType: { type: "string" },
      },
      required: ["fileType"],
    },
  },
  required: ["queryStringParameters"],
} as const;
