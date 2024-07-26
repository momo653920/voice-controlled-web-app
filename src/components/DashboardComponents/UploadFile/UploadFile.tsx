import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../redux/actionCreators/fileFoldersActionCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface FileData {
  name: string;
  data: string;
}

interface CurrentFolder {
  docId: string;
  data: {
    path: string[];
  };
}

interface State {
  filefolders: {
    userFiles: FileData[];
    currentFolder: string;
    userFolders: CurrentFolder[];
  };
  auth: {
    user: {
      uid: string;
      displayName: string;
    };
  };
}

interface UploadFileProps {
  setIsFileUploadModalOpen: (isOpen: boolean) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({
  setIsFileUploadModalOpen,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to manage loading state
  const [success, setSuccess] = useState<boolean>(false);

  const { userFiles, user, currentFolder, currentFolderData } = useSelector(
    (state: State) => ({
      userFiles: state.filefolders.userFiles,
      user: state.auth.user,
      currentFolder: state.filefolders.currentFolder,
      currentFolderData: state.filefolders.userFolders.find(
        (folder) => folder.docId === state.filefolders.currentFolder
      ),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (file && checkFileAlreadyPresent(file.name)) {
      setError("File already exists");
      return;
    }

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);

    const data = {
      createdAt: new Date(),
      name: file.name,
      userId: user.uid,
      createdBy: user.displayName,
      path:
        currentFolder === "root"
          ? []
          : [...(currentFolderData?.data?.path || []), currentFolder],
      parent: currentFolder,
      lastAccessed: null,
      updatedAt: new Date(),
      extension: file.name.split(".").pop()?.toLowerCase() || "unknown",
      url: URL.createObjectURL(file),
      data: "",
    };

    try {
      await dispatch(uploadFile(file, data, setSuccess));
      setIsFileUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkFileAlreadyPresent = (name: string) => {
    const filePresent = userFiles
      .filter((file) => file.data.parent === currentFolder)
      .find((file) => file.data.name === name);
    return filePresent ? true : false;
  };

  useEffect(() => {
    if (success) {
      setFile(null);
      setSuccess(false);
      setIsFileUploadModalOpen(false);
    }
  }, [success, setIsFileUploadModalOpen]);

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
          <h4 className="m-0">Upload File</h4>
          <button
            className="btn"
            onClick={() => setIsFileUploadModalOpen(false)}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} className="text-black" />
          </button>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message alert alert-danger">{error}</div>
          )}
          <div className="form-group">
            <input
              type="file"
              className="form-control"
              id="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFile(e.target.files ? e.target.files[0] : null);
                setError("");
              }}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3 w-100"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
