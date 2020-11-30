import * as AwsConfig from "serverless/aws";
import { merge } from "lodash";

import { DEFAULT_STAGE, HTTP_API_ID } from "./common.serverless";

import { ref } from "./libs/cloudformation";
import { Bucket } from "./resources/s3";
import {
  getSignedUploadUrl,
  getSignedDownloadUrl,
  dispatchFileUploadedEvent as dispatchFileUpload,
} from "./functions/config";
import { TokenTable } from "./resources/dynamodb";
import { EventBridge } from "./resources/event-bridge";

const cloudformationResources: AwsConfig.CloudFormationResources = {
  Bucket,
  TokenTable,
  EventBridge,
};

const cloudformationStageSpecificCustoms = {
  HTTP_API_ID,
};

const serverlessConfiguration: AwsConfig.Serverless = {
  service: "S4",
  frameworkVersion: ">=2.4.0",
  plugins: ["serverless-webpack", "serverless-pseudo-parameters"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
    stage: `\${opt:stage, '${DEFAULT_STAGE}'}`,
    environment: { AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1" },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Resource: [
          {
            "Fn::Join": ["", [{ "Fn::GetAtt": ["Bucket", "Arn"] }, "/*"]],
          },
        ],
        Action: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      },
      {
        Effect: "Allow",
        Resource: [{ "Fn::GetAtt": ["TokenTable", "Arn"] }],
        Action: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:DeleteItem"],
      },
      {
        Effect: "Allow",
        Resource: [{ "Fn::GetAtt": ["EventBridge", "Arn"] }],
        Action: ["events:PutEvents"],
      },
    ],
    httpApi: {
      payload: "2.0",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cors: {
        allowedOrigins: ["http://localhost:3000"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin"],
        allowedMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      },
    },
  },
  functions: {
    getSignedUploadUrl,
    getSignedDownloadUrl,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dispatchFileUpload,
  },
  custom: merge(cloudformationStageSpecificCustoms, {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    bucketName: ref(cloudformationResources, Bucket),
    tokenTableName: ref(cloudformationResources, TokenTable),
    tokenTableStreamArn: { "Fn::GetAtt": ["TokenTable", "StreamArn"] },
    tokenTableArn: { "Fn::GetAtt": ["TokenTable", "Arn"] },
    eventBusName: ref(cloudformationResources, EventBridge),
    eventBridgeArn: { "Fn::GetAtt": ["EventBridge", "Arn"] },
  }),
  resources: {
    Resources: cloudformationResources,
  },
};

module.exports = serverlessConfiguration;
