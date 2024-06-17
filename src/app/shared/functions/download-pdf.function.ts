export interface DownloadFile {
  name: string;
  file: BlobPart;
  type?: string;
}

export const downloadFile = ({ file, name, type }: DownloadFile) => {
  const blob = new Blob([file], { type: type ?? 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = name;
  link.click();
};
