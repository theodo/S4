import { Entity } from "dynamodb-toolbox";
import dayjs from "dayjs";

import { TokenTableEntity } from "./TokenTableEntity";

const FileUploadToken = new Entity({
  name: "FileUploadToken",
  attributes: {
    pk: { partitionKey: true, hidden: true },
    uploadToken: { sortKey: true },
    ressourceName: "string",
    ressourceId: "string",
    email: "string",
    _ttl: { default: () => dayjs().add(5, "minute").unix() },
  },
  table: TokenTableEntity,
});

export default FileUploadToken;
