import React, { useState } from "react";
import JSZip, { JSZipObject } from "jszip";
import FaresBuilder from "./components/FaresBuilder";
import FileService from "./services/FileService";
import Packet, { samplePacket } from "./interfaces/Packet";
import ewayLogo from "./images/eway-logo.png";
import "./App.scss";

enum AppMode {
  FILE_UPLOADING,
  FARES_BUILDER,
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(AppMode.FILE_UPLOADING);
  const requiredFileNames = ["stops.txt"];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsLoading(true);

      if (event.target.files.length === 1) {
        const zipFile = event.target.files[0];
        processUploadedZip(zipFile);
      } else {
        const files = Array.from(event.target.files);
        processUploadedFiles(files);
      }
    }
  };

  const processUploadedZip = (zipFile: Blob | File) => {
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
        processUploadedFilesPromises(filePromises, fileNames);
      },
      function (e) {
        alert(e.message);
      }
    );
  };

  const processUploadedFiles = (files: File[]) => {
    const fileNames: string[] = [];
    const filePromises = Promise.all(
      files
        .filter((file: File) => file.name.indexOf(".txt") !== -1)
        .map((file: File) => {
          fileNames.push(file.name);
          return FileService.readUploadedFileAsText(file);
        })
    );
    processUploadedFilesPromises(filePromises, fileNames);
  };

  const processUploadedFilesPromises = (
    filePromises: Promise<string[]>,
    fileNames: string[]
  ) => {
    if (!checkRequiredFiles(fileNames)) {
      setIsLoading(false);
      return;
    }

    let packet: { [key: string]: any } = {};

    filePromises.then((fileContents: string[]) => {
      fileContents.forEach((fileContent: string, fileIndex: number) => {
        const fileNameWithoutExt = fileNames[fileIndex].substring(0, -4);
        if (fileNameWithoutExt in samplePacket) {
          packet[fileNameWithoutExt] = extractData(fileContent);
        }
      });

      console.log(packet as Packet);

      setIsLoading(false);
      setMode(AppMode.FARES_BUILDER);
    });
  };

  const checkRequiredFiles = (fileNames: string[]): boolean => {
    const requiredFileMissing = requiredFileNames.some(
      (requiredFileName: string) => {
        return (
          fileNames.findIndex((fileName) => fileName === requiredFileName) ===
          -1
        );
      }
    );
    if (requiredFileMissing) {
      alert(
        "You missed some of the required files: [" +
          requiredFileNames.join(", ") +
          "]"
      );
      return false;
    } else {
      return true;
    }
  };

  const extractData = (fileContent: string): {}[] => {
    return [];
  };

  return (
    <div className="gtfs-fares-builder-container">
      {isLoading && <div className="loader"></div>}

      {mode === AppMode.FILE_UPLOADING && (
        <div className="main">
          <img src={ewayLogo} alt="EasyWay logo" />
          <h2>GTFS fares builder</h2>
          <div>Select a GTFS feed:</div>
          <input type="file" multiple={true} onChange={handleFileUpload} />
        </div>
      )}

      {mode === AppMode.FARES_BUILDER && <FaresBuilder></FaresBuilder>}
    </div>
  );
}

export default App;
