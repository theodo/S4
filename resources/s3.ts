import { AWS } from "@serverless/typescript";

export const Bucket: AWS["resources"]["Resources"]["value"] = {
  Type: "AWS::S3::Bucket",
  DeletionPolicy: "Retain",
  Properties: {
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedOrigins: ["*"],
          AllowedHeaders: ["*"],
          AllowedMethods: ["POST"],
        },
      ],
    },
  },
};
