import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";

const CreateFolder = ({ setIsCreateFolderModalOpen }) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const { userFolders, user, currentFolder } = useSelector(
    (state) => ({ 
      userFolders: state.filefolders.userFolders || [],
      user: state.auth.user,
      currentFolder: state.filefolders.currentFolder,
    }),
    shallowEqual
  );

  const currentFolderData = useMemo(() => currentFolder === 'root'
    ? { data: { path: [] } } // Set a default path for root
    : userFolders.find(folder => folder.docId === currentFolder), [currentFolder, userFolders]);

  const checkFolderAlreadyPresent = (name) => {
    return userFolders.some((folder) => 
      folder.data.parent === currentFolder && folder.data.name === name
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    if (checkFolderAlreadyPresent(folderName)) {
      setError("Folder already exists");
      return;
    }

    let path = currentFolderData.data.path ? [...currentFolderData.data.path, currentFolder] : [currentFolder];

    const data = {
      createdAt: new Date(),
      name: folderName,
      userId: user.uid,
      createdBy: user.displayName,
      path: path,
      parent: currentFolder,
      lastAccessed: null,
      updatedAt: new Date(),
    };

    setIsLoading(true); // Set loading to true before dispatching action
    try {
      await dispatch(createFolder(data));
      setIsCreateFolderModalOpen(false);
    } catch (error) {
      setError("Failed to create folder. Please try again later.");
      console.error("Error creating folder:", error);
    } finally {
      setIsLoading(false); // Set loading to false after action is complete
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
    <div className="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: "rgba(0,0,0,0.4)", zIndex: 9999 }}>
      <div ref={modalRef} className="bg-white p-4 rounded shadow" style={{ maxWidth: "600px", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Create Folder</h4>
          <button className="btn" onClick={() => setIsCreateFolderModalOpen(false)}>
            <FontAwesomeIcon icon={faTimes} className="text-black" />
          </button>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message alert alert-danger">{error}</div>}
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
              disabled={isLoading} // Disable input when loading
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;
