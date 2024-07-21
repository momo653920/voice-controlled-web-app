import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import Editor from "./Editor";
import { updateFileData } from "../../../redux/actionCreators/fileFoldersActionCreator";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import debounce from "lodash.debounce";

interface FileData {
  data: string;
  name: string;
  url?: string;
  extension?: string;
}

interface CurrentFile {
  docId: string;
  data: FileData;
  createdAt: Date;
  updatedAt: Date;
}

interface State {
  filefolders: {
    userFiles: CurrentFile[];
  };
}

interface FileComponentProps {
  fileName?: string;
}

const FileComponent: React.FC<FileComponentProps> = ({ fileName }) => {
  const { fileId } = useParams<{ fileId: string }>();
  const [fileData, setFileData] = useState<string>("");
  const [prevFileData, setPrevFileData] = useState<string>("");
  const dispatch = useDispatch();

  const { currentFile } = useSelector(
    (state: State) => ({
      currentFile: state.filefolders.userFiles.find(
        (file) => file.docId === fileId
      ),
    }),
    shallowEqual
  );

  useEffect(() => {
    if (currentFile) {
      setFileData(currentFile.data.data || "");
      setPrevFileData(currentFile.data.data || "");
    }
  }, [currentFile]);

  const debouncedUpdateFileData = useCallback(
    debounce((fileId: string, data: string) => {
      dispatch(updateFileData(fileId, data));
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (fileData !== prevFileData) {
      debouncedUpdateFileData(fileId, fileData);
      setPrevFileData(fileData);
    }
  }, [fileData, prevFileData, debouncedUpdateFileData, fileId]);

  const renderFileContent = () => {
    if (!currentFile) {
      return <div>Loading...</div>;
    }

    const { extension, url } = currentFile.data;

    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return (
          <img
            src={url}
            alt="File"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        );
      case "pdf":
        return (
          <iframe
            src={url}
            title="PDF"
            style={{ width: "100%", height: "80vh" }}
          />
        );
      case "txt":
        return <Editor data={fileData} setData={setFileData} />;
      case "docx":
        return (
          <div>
            <a href={url} download>
              Download Document
            </a>
          </div>
        );
      case "json":
      case "js":
      case "html":
      case "css":
        return (
          <SyntaxHighlighter language={extension} style={solarizedlight}>
            {fileData}
          </SyntaxHighlighter>
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <div>
      <Header
        fileName={currentFile?.data.name || ""}
        lastModified={currentFile?.updatedAt || new Date()}
      />
      {renderFileContent()}
    </div>
  );
};

export default FileComponent;
