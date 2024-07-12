import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";

const CreateFolder = ({ setIsCreateFolderModalOpen }) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const { userFolders, user, currentFolder, currentFolderData } = useSelector(
    (state) => ({
      userFolders: state.filefolders.userFolders,
      user: state.auth.user,
      currentFolder: state.filefolders.currentFolder,
      currentFolderData: state.filefolders.userFolders.find(
        (folder) => folder.docId === state.filefolders.currentFolder
      ),
    }),
    shallowEqual
  );

  const checkFolderAlreadyPresent = (name) => {
    return userFolders
      .filter((folder) => folder.data.parent === currentFolder)
      .some((folder) => folder.data.name === name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      if (checkFolderAlreadyPresent(folderName)) {
        setError("Folder already exists");
        return;
      }

      // Ensure currentFolderData is defined
      if (!currentFolderData) {
        setError("Current folder data is undefined");
        return;
      }

      const data = {
        createdAt: new Date(),
        name: folderName,
        userId: user.uid,
        createdBy: user.displayName,
        path:
          currentFolder === "root"
            ? []
            : [...currentFolderData.data.path, currentFolder],
        parent: currentFolder, // Assign parent field here
        lastAccessed: null,
        updatedAt: new Date(),
      };

      // Ensure all fields are defined and log each field
      const cleanData = {};
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value === undefined) {
          console.warn(`Field ${key} is undefined`);
        }
        cleanData[key] = value !== undefined ? value : null;
      });

      dispatch(createFolder(cleanData));
      setIsCreateFolderModalOpen(false);
    } else {
      setError("Folder name cannot be empty");
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsCreateFolderModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 9999 }}
    >
      <div
        ref={modalRef}
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
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100">
            Create Folder
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;
