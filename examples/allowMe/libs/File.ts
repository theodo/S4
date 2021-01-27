import { Entity } from "dynamodb-toolbox";
import { TokenTableEntity } from "../../../libs/TokenTableEntity";

export const File = new Entity({
  name: "File",
  attributes: {
    pk: { partitionKey: true, hidden: true },
    filePrefix: { sortKey: true },
    fileName: "string",
    fileSize: "number",
    fileType: "string",
    bucketName: "string",
  },
  table: TokenTableEntity,
});
