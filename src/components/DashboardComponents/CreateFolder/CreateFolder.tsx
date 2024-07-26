import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateFolder = ({ setIsCreateFolderModalOpen }) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { userFolders, user, currentFolder } = useSelector(
    (state) => ({
      userFolders: state.filefolders.userFolders,
      user: state.auth.user,
      currentFolder: state.filefolders.currentFolder,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const checkFolderAlreadyPresent = (name) => {
    const folderPresent = userFolders
      .filter((folder) => folder.data.parent === currentFolder)
      .find((fldr) => fldr.data.name === name);
    return folderPresent ? true : false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (folderName.trim().length === 0) {
      setError("Folder name cannot be empty");
      return;
    }
    if (folderName.trim().length < 4) {
      setError("Folder name should be at least 4 characters long");
      return;
    }
    if (checkFolderAlreadyPresent(folderName)) {
      setError("Folder already exists");
      return;
    }

    setIsLoading(true);

    const data = {
      createdAt: new Date(),
      name: folderName,
      userId: user.uid,
      createdBy: user.displayName,
      path:
        currentFolder === "root"
          ? []
          : [...(currentFolder?.data?.path || []), currentFolder],
      parent: currentFolder,
      lastAccessed: null,
      updatedAt: new Date(),
    };

    try {
      await dispatch(createFolder(data));
      setIsCreateFolderModalOpen(false);
    } catch (error) {
      console.error("Error creating folder:", error);
      setError("Failed to create folder. Please try again.");
    } finally {
      setIsLoading(false);
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
          <h4 className="m-0">Create Folder</h4>
          <button
            className="btn"
            onClick={() => setIsCreateFolderModalOpen(false)}
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
              id="folderName"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
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
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;
