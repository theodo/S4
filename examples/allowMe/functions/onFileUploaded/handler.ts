import { EventBridgeEvent } from "aws-lambda";

import { File } from "../../libs/File";
import { UploadedFile } from "../../libs/types";

const onFileUploaded = async (
  event: EventBridgeEvent<"TEST_FILE_UPLOADED", UploadedFile>
): Promise<void> => {
  // Gather file uploaded data from TEST_FILE_UPLOADED event
  const { filePrefix, fileName, fileSize, fileType, bucketName } = event[
    "detail"
  ];

  // Put them in our database
  await File.put({
    pk: File.name,
    filePrefix,
    fileName,
    fileSize,
    fileType,
    bucketName,
  });
};

export const main = onFileUploaded;
