import React, { useState } from "react";
import JSZip, { JSZipObject } from "jszip";
import FaresBuilder from "./components/FaresBuilder";
import FileService from "./services/FileService";
import Communication from "./interfaces/Communication";
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsLoading(true);

      // Zip
      if (event.target.files.length === 1) {
        const zipFile = event.target.files[0];
        handleZip(zipFile);
      }

      // Separate files
      else {
        const files = Array.from(event.target.files);
        handleFiles(files);
      }
    }
  };

  const handleFiles = (files: File[]) => {
    const fileNames: string[] = [];
    const filePromises = Promise.all(
      files
        .filter((file: File) => file.name.indexOf(".txt") !== -1)
        .map((file: File) => {
          fileNames.push(file.name);
          return FileService.readUploadedFileAsText(file);
        })
    );

    if (!checkRequiredFiles(fileNames)) {
      setIsLoading(false);
      return;
    }

    handleFilePromises(filePromises, fileNames);
  };

  const handleZip = (zipFile: Blob | File) => {
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

        if (!checkRequiredFiles(fileNames)) {
          setIsLoading(false);
          return;
        }

        handleFilePromises(filePromises, fileNames);
      },
      function (e) {
        alert(e.message);
      }
    );
  };

  const handleFilePromises = (
    filePromises: Promise<string[]>,
    fileNames: string[]
  ) => {
    let communicationPacket: Communication = {
      stops: [],
    };

    filePromises.then((fileContents: string[]) => {
      const untouchedFiles: { [key: string]: string } = {};
      fileContents.forEach((fileContent: string, fileIndex: number) => {
        const fileExtracted = extractData(
          fileNames[fileIndex],
          fileContent,
          communicationPacket
        );
        if (!fileExtracted) {
          untouchedFiles[fileNames[fileIndex]] = fileContent;
        }
      });

      // Set id's initial values for new stops and pathways
      let minStopId = 0;
      communicationPacket.stops.forEach((stop) => {
        if (Number(stop.stopId) < minStopId) {
          minStopId = Number(stop.stopId);
        }
      });

      console.log(communicationPacket);
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

  const extractData = (
    fileName: string,
    data: string,
    communicationPacket: Communication
  ): boolean => {
    switch (fileName) {
      case "stops.txt":
        // communicationPacket.stops = DataService.fromGTFS(
        //   data,
        //   DataService.stopFromGTFS
        // );
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="gtfs-fares-builder-container">
      {isLoading && <div className="loader"></div>}

      {mode === AppMode.FILE_UPLOADING && (
        <div className="main">
          <img src={ewayLogo} alt="EasyWay logo" />
          <h2>GTFS fares builder</h2>
          <div>Select a GTFS feed:</div>
          <input type="file" multiple={true} onChange={handleFileChange} />
        </div>
      )}

      {mode === AppMode.FARES_BUILDER && <FaresBuilder></FaresBuilder>}
    </div>
  );
}

export default App;
