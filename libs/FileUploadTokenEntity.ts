import { Entity } from "dynamodb-toolbox";
import dayjs from "dayjs";
import { TokenTable } from "../resources/dynamodb";

const FileUploadToken = new Entity({
  name: "FileUploadToken",
  attributes: {
    pk: { partitionKey: true, hidden: true },
    sk: { sortKey: true },
    ressourceName: "string",
    ressourceId: "string",
    email: "string",
    _ttl: { default: () => dayjs().add(5, "minute").unix() },
  },
  table: TokenTable,
});

export default FileUploadToken;
