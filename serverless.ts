import { AWS } from "@serverless/typescript";

import { ref } from "./libs/cloudformation";
import { Bucket } from "./resources/s3";
import {
  getSignedUploadUrl,
  getSignedDownloadUrl,
  dispatchFileUploadedEvent as dispatchFileUpload,
} from "./functions/config";

import {
  TokenTable,
  TokenTableName,
  TokenTableArn,
} from "./resources/dynamodb";
import { EventBridge } from "./resources/event-bridge";
import {
  getDownloadUrlAuthorizer,
  getUploadUrlAuthorizer,
  onFileUploaded,
  listFiles,
} from "./examples/allowMe/functions/config";

const cloudformationResources: AWS["resources"]["Resources"] = {
  Bucket,
  TokenTable,
  EventBridge,
};

const serverlessConfiguration: AWS = {
  service: "S4",
  frameworkVersion: ">=2.4.0",
  plugins: ["serverless-webpack", "serverless-pseudo-parameters"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
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
        Action: [
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:PutItem",
        ],
      },
      {
        Effect: "Allow",
        Resource: [{ "Fn::GetAtt": ["EventBridge", "Arn"] }],
        Action: ["events:PutEvents"],
      },
      {
        Effect: "Allow",
        Resource:
          "arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:${self:service}-${self:provider.stage}-getSignedDownloadUrl",
        Action: ["lambda:InvokeFunction"],
      },
    ],
    httpApi: {
      payload: "2.0",
      cors: {
        allowedOrigins: ["*"],
        allowedHeaders: ["Content-Type", "Origin"],
        allowedMethods: ["POST", "OPTIONS", "GET"],
      },
    },
  },
  functions: {
    getDownloadUrlAuthorizer,
    getUploadUrlAuthorizer,
    getSignedUploadUrl,
    getSignedDownloadUrl,
    dispatchFileUpload,
    onFileUploaded,
    listFiles,
  },
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    bucketName: ref({ Bucket }),
    tokenTableName: ref({ TokenTable }),
    tokenTableStreamArn: { "Fn::GetAtt": ["TokenTable", "StreamArn"] },
    tokenTableArn: { "Fn::GetAtt": ["TokenTable", "Arn"] },
    eventBusName: ref({ EventBridge }),
    eventBridgeArn:
      "arn:aws:events:#{AWS::Region}:#{AWS::AccountId}:event-bus/s4",
    getSignedDownloadUrlArn: {
      "Fn::GetAtt": ["GetSignedDownloadUrlLambdaFunction", "Arn"],
    },
    getSignedUploadUrlArn: {
      "Fn::GetAtt": ["GetSignedUploadUrlLambdaFunction", "Arn"],
    },
  },
  resources: {
    Resources: cloudformationResources,
    Outputs: {
      TokenTableName,
      TokenTableArn,
    },
  },
};

module.exports = serverlessConfiguration;
