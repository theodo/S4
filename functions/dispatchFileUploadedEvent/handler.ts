import { S3Event, S3EventRecord } from "aws-lambda";
import EventBridge from "aws-sdk/clients/eventbridge";
import { isEmpty } from "lodash";
import { S3 } from "aws-sdk";
import FileType from "file-type";
import { makeTokenizer } from "@tokenizer/s3";
import FileUploadToken from "../../libs/FileUploadTokenEntity";

const S3Client = new S3({ signatureVersion: "v4" });
const eventBridge = new EventBridge();

const urlDecode = (url: string) => decodeURIComponent(url.replace(/\+/g, " "));

export const main = async (event: S3Event): Promise<void> => {
  const putEventsPayload = {};
  await Promise.all(
    event.Records.map(async (eventRecord: S3EventRecord) => {
      const bucketName = eventRecord.s3.bucket.name;
      const objectKey = urlDecode(eventRecord.s3.object.key);
      const [uploadToken, filename] = objectKey.split("/");
      const fileSize = eventRecord.s3.object.size;

      const s3Tokenizer = await makeTokenizer(S3Client, {
        Bucket: bucketName,
        Key: objectKey,
      });

      const { ext } = await FileType.fromTokenizer(s3Tokenizer);

      if (ext !== filename.split(".").slice(-1)[0]) {
        await S3Client.deleteObject({
          Bucket: bucketName,
          Key: objectKey,
        }).promise();
        console.log(
          `Found inconsistent uploaded file type, deleting ${objectKey}`
        );
        return;
      }

      const { Item } = await FileUploadToken.get(
        {
          pk: FileUploadToken.name,
          sk: uploadToken,
        },
        { consistent: true }
      );

      if (!Item) {
        return;
      }

      const newEvent = {
        Source: "S4-events",
        DetailType: `${Item.ressourceName}_FILE_UPLOADED`,
        Detail: JSON.stringify({
          payload: {
            bucketName,
            filename,
            fileSize,
            ...Item,
          },
        }),
        EventBusName: process.env.EVENT_BUS_NAME,
      };
      putEventsPayload[uploadToken] = newEvent;
    })
  );

  if (!isEmpty(putEventsPayload)) {
    await eventBridge
      .putEvents({ Entries: Object.values(putEventsPayload) })
      .promise();
    await Promise.all(
      Object.keys(putEventsPayload).map((uploadToken) =>
        FileUploadToken.delete({
          pk: FileUploadToken.name,
          sk: uploadToken,
        })
      )
    );
  }
};
