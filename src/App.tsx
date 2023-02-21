import React, { useState } from "react";
import FaresBuilder from "./components/FaresBuilder";
import FileService from "./services/FileService";
import ewayLogo from "./images/eway-logo.png";
import "./App.scss";
import GtfsParseService from "./services/GtfsParseService";

enum AppMode {
  FILE_UPLOADING,
  FARES_BUILDER,
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(AppMode.FILE_UPLOADING);
  const [packet, setPacket] = useState({});
  const requiredFileNames = ["stops.txt"];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsLoading(true);
      FileService.readFiles(event.target.files, processFilesPromises);
    }
  };

  const processFilesPromises = (
    filePromises: Promise<string[]>,
    fileNames: string[]
  ) => {
    if (!checkRequiredFiles(fileNames)) {
      setIsLoading(false);
      return;
    }

    let tmpPacket: { [key: string]: any } = {};

    filePromises.then((fileContents: string[]) => {
      fileContents.forEach((fileContent: string, fileIndex: number) => {
        const fileNameWithoutExt = fileNames[fileIndex].slice(0, -4);
        tmpPacket[fileNameWithoutExt] = GtfsParseService.fromGTFS(fileContent);
      });

      setPacket(tmpPacket);
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

      {mode === AppMode.FARES_BUILDER && (
        <FaresBuilder packet={packet}></FaresBuilder>
      )}
    </div>
  );
}

export default App;
