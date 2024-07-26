import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createFile } from "../../../redux/actionCreators/fileFoldersActionCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateFile = ({ setIsCreateFileModalOpen }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [success, setSuccess] = useState(false);

  const { userFiles, user, currentFolder, currentFolderData } = useSelector(
    (state) => ({
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

  useEffect(() => {
    if (success) {
      setFileName("");
      setSuccess(false);
      setIsCreateFileModalOpen(false);
    }
  }, [success]);

  const checkFileAlreadyPresent = (name, extension) => {
    if (!extension) {
      name = name + ".txt";
    }
    const filePresent = userFiles
      .filter((file) => file.data.parent === currentFolder)
      .find((fldr) => fldr.data.name === name);
    return filePresent ? true : false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileName.trim().length === 0) {
      setError("File name cannot be empty");
      return;
    }
    if (fileName.trim().length < 4) {
      setError("File name should be at least 4 characters long");
      return;
    }
    let extension = false;
    if (fileName.split(".").length > 1) {
      extension = true;
    }
    if (checkFileAlreadyPresent(fileName, extension)) {
      setError("File already exists");
      return;
    }

    setIsLoading(true);

    const data = {
      createdAt: new Date(),
      name: extension ? fileName : fileName + ".txt",
      userId: user.uid,
      createdBy: user.displayName,
      path:
        currentFolder === "root"
          ? []
          : [...(currentFolder?.data?.path || []), currentFolder],
      parent: currentFolder,
      lastAccessed: null,
      updatedAt: new Date(),
      extension: extension ? fileName.split(".")[1] : "txt",
      data: "",
      url: "null",
    };

    try {
      await dispatch(createFile(data, setSuccess));
      setIsCreateFileModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error creating file:", error);
      setError("Failed to create file. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
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
          <h4 className="m-0">Create File</h4>
          <button
            className="btn"
            onClick={() => setIsCreateFileModalOpen(false)}
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
              type="text"
              className="form-control"
              id="fileName"
              placeholder="File Name"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
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
            {isLoading ? "Creating..." : "Create File"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFile;
