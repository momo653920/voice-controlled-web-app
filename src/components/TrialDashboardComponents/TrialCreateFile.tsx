import React, { useState } from "react";
import { setCookie, getCookie } from "./cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

const TrialCreateFile: React.FC<{
  setIsCreateFileModalOpen: (open: boolean) => void;
}> = ({ setIsCreateFileModalOpen }) => {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName) {
      const fileNameWithExtension = fileName.endsWith(".txt")
        ? fileName
        : `${fileName}.txt`;
      const existingFiles = JSON.parse(getCookie("files") || "[]");
      const newFile = {
        id: uuidv4(),
        name: fileNameWithExtension,
        data: fileContent,
      };
      const updatedFiles = [...existingFiles, newFile];
      setCookie("files", JSON.stringify(updatedFiles));
      setIsCreateFileModalOpen(false);
      window.location.reload();
    }
  };

  return (
    <div
      className="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 9999 }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{
          maxWidth: "600px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Създай файл</h4>
          <button
            className="btn"
            onClick={() => setIsCreateFileModalOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} className="text-black" />
          </button>
        </div>
        <hr />
        <form onSubmit={handleCreateFile}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="fileName"
              placeholder="File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100">
            Създай
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrialCreateFile;
