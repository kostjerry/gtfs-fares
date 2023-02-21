import JSZip, { JSZipObject } from "jszip";

export default class FileService {
  public static readFiles = (
    files: FileList,
    callback: (filePromises: Promise<string[]>, fileNames: string[]) => void
  ) => {
    if (files.length === 1) {
      this.processUploadedZip(files[0], callback);
    } else {
      this.processUploadedFiles(Array.from(files), callback);
    }
  };

  private static processUploadedZip = (
    zipFile: Blob | File,
    callback: (filePromises: Promise<string[]>, fileNames: string[]) => void
  ) => {
    JSZip.loadAsync(zipFile).then(
      (zip) => {
        const files: JSZipObject[] = [];
        zip.forEach((relativePath, file) => {
          files.push(file);
        });

        const fileNames: string[] = [];
        const filePromises = Promise.all(
          files
            .filter((file: JSZipObject) => file.name.indexOf(".txt") !== -1)
            .map((file: JSZipObject) => {
              fileNames.push(file.name);
              return file.async("text");
            })
        );
        callback(filePromises, fileNames);
      },
      function (e) {
        alert(e.message);
      }
    );
  };

  private static processUploadedFiles = (
    files: File[],
    callback: (filePromises: Promise<string[]>, fileNames: string[]) => void
  ) => {
    const fileNames: string[] = [];
    const filePromises = Promise.all(
      files
        .filter((file: File) => file.name.indexOf(".txt") !== -1)
        .map((file: File) => {
          fileNames.push(file.name);
          return this.readUploadedFileAsText(file);
        })
    );
    callback(filePromises, fileNames);
  };

  private static readUploadedFileAsText = async (
    inputFile: File
  ): Promise<string> => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Error while parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve((temporaryFileReader.result || "") as string);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };
}
