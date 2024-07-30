import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import FileHeader from "../TrialDashboardComponents/TrialFileHeader";
import Editor from "../DashboardComponents/FileComponent/Editor";
import debounce from "lodash.debounce";
import { getCookie, setCookie } from "./cookieUtils";

const TrialFileComponent: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [fileData, setFileData] = useState<string>("");
  const [prevFileData, setPrevFileData] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<any | null>(null);

  useEffect(() => {
    const files = JSON.parse(getCookie("files") || "[]");
    const file = files.find((file: any) => file.id === fileId);
    if (file) {
      setCurrentFile({
        docId: fileId,
        data: file,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setFileData(file.data || "");
      setPrevFileData(file.data || "");
    }
  }, [fileId]);

  const saveFileData = (data: string) => {
    const files = JSON.parse(getCookie("files") || "[]");
    const updatedFiles = files.map((file: any) => {
      if (file.id === fileId) {
        return { ...file, data };
      }
      return file;
    });
    setCookie("files", JSON.stringify(updatedFiles));
  };

  const debouncedUpdateFileData = useCallback(
    debounce((data: string) => {
      saveFileData(data);
    }, 1000),
    []
  );

  useEffect(() => {
    if (fileData !== prevFileData) {
      debouncedUpdateFileData(fileData);
      setPrevFileData(fileData);
    }
  }, [fileData, prevFileData, debouncedUpdateFileData]);

  return (
    <div>
      <FileHeader
        fileName={currentFile?.data.name || "Untitled"}
        lastModified={currentFile?.updatedAt || new Date()}
      />
      <Editor data={fileData} setData={setFileData} />
    </div>
  );
};

export default TrialFileComponent;
