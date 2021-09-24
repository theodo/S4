import { S3Event, S3EventRecord } from "aws-lambda";
import EventBridge from "aws-sdk/clients/eventbridge";
import { isEmpty } from "lodash";
import { S3 } from "aws-sdk";
import FileType from "file-type";
import { makeTokenizer } from "@tokenizer/s3";

const S3Client = new S3({ signatureVersion: "v4" });
const eventBridge = new EventBridge();

const urlDecode = (url: string) => decodeURIComponent(url.replace(/\+/g, " "));

export const main = async (event: S3Event): Promise<void> => {
  const putEventsPayload = {};
  await Promise.all(
    event.Records.map(async (eventRecord: S3EventRecord) => {
      const bucketName = eventRecord.s3.bucket.name;
      const objectKey = urlDecode(eventRecord.s3.object.key);
      const [filePrefix, fileName] = objectKey.split("/");
      const fileSize = eventRecord.s3.object.size;

      const s3Tokenizer = await makeTokenizer(S3Client, {
        Bucket: bucketName,
        Key: objectKey,
      });

      const { ext } = await FileType.fromTokenizer(s3Tokenizer);

      if (ext !== fileName.split(".").slice(-1)[0]) {
        await S3Client.deleteObject({
          Bucket: bucketName,
          Key: objectKey,
        }).promise();
        console.log(
          `Found inconsistent uploaded file type, deleting ${objectKey}`
        );
        return;
      }

      const newEvent = {
        Source: "s4-events",
        DetailType: `FILE_UPLOADED`,
        Detail: JSON.stringify({
          bucketName,
          fileName,
          fileSize,
          filePrefix,
          fileType: ext,
        }),
        EventBusName: process.env.EVENT_BUS_NAME,
      };
      putEventsPayload[filePrefix] = newEvent;
    })
  );

  if (!isEmpty(putEventsPayload)) {
    await eventBridge
      .putEvents({ Entries: Object.values(putEventsPayload) })
      .promise();
  }
};
