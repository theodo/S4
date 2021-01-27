const maxFileSizeByFormat = [
  { regexp: new RegExp("image/(\\w+)"), maxSize: 10e6 },
  { regexp: new RegExp("application/(.+)\\.docx"), maxSize: 10e6 },
  { regexp: new RegExp("application/(.+)\\.doc"), maxSize: 10e6 },
  { regexp: new RegExp("application/(.+)\\.pptx"), maxSize: 10e6 },
  { regexp: new RegExp("application/(.+)\\.ppt"), maxSize: 10e6 },
  { regexp: new RegExp("application/(.+)\\.xlsx"), maxSize: 10e6 },
  { regexp: new RegExp("application/(.+)\\.xls"), maxSize: 10e6 },
  { regexp: new RegExp("application/pdf"), maxSize: 10e6 },
  { regexp: new RegExp("video/(\\w+)"), maxSize: 100e6 },
];

export const getFileSizeLimit = (fileType: string): number => {
  for (const { regexp, maxSize } of maxFileSizeByFormat) {
    if (regexp.exec(fileType)) {
      return maxSize;
    }
  }
  return 0;
};
