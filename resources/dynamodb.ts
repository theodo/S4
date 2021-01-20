import { AWS } from "@serverless/typescript";

export enum KeyType {
  HASH = "HASH",
  RANGE = "RANGE",
}
const { HASH, RANGE } = KeyType;

export const PRIMARY_KEY = "pk";
export const SORT_KEY = "sk";
export const LSI_KEYS = { LSI: "lsi" };

export const LSI = {
  BY_LSI: {
    IndexName: "byLsi",
    KeySchema: [
      { AttributeName: PRIMARY_KEY, KeyType: HASH },
      { AttributeName: LSI_KEYS.LSI, KeyType: RANGE },
    ],
    Projection: { ProjectionType: "ALL" },
  },
};

export const TokenTable: AWS["resources"]["Resources"]["value"] = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    AttributeDefinitions: [
      { AttributeName: PRIMARY_KEY, AttributeType: "S" },
      { AttributeName: SORT_KEY, AttributeType: "S" },
      { AttributeName: LSI_KEYS.LSI, AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: PRIMARY_KEY, KeyType: HASH },
      { AttributeName: SORT_KEY, KeyType: RANGE },
    ],
    BillingMode: "PAY_PER_REQUEST",
    LocalSecondaryIndexes: [LSI.BY_LSI],
    TimeToLiveSpecification: {
      AttributeName: "_ttl",
      Enabled: true,
    },
    StreamSpecification: {
      StreamViewType: "NEW_AND_OLD_IMAGES",
    },
  },
};

export const TokenTableName: AWS["resources"]["Outputs"] = {
  Value: { Ref: "TokenTable" },
  Export: { Name: "TokenTable" },
};

export const TokenTableArn: AWS["resources"]["Outputs"] = {
  Value: { "Fn::GetAtt": ["TokenTable", "Arn"] },
  Export: { Name: "TokenTableArn" },
};
