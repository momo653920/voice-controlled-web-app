import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";

const CreateFolder = ({ setIsCreateFolderModalOpen }) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  const { userFolders, user, currentFolder } = useSelector(
    (state) => ({
      userFolders: state.filefolders.userFolders,
      user: state.auth.user,
      currentFolder: state.filefolders.currentFolder,
    }),
    shallowEqual
  );

  const checkFolderAlreadyPresent = (name) => {
    const folderPresent = userFolders.find((folder) => folder.name === name);
    if (folderPresent) {
      return true;
    }
    return false;
  };
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      if (checkFolderAlreadyPresent(folderName)) {
        setError("Folder already exists");
        return;
      }

      const data = {
        createdAt: new Date(),
        name: folderName,
        userId: user.uid,
        createdBy: user.displayName,
        path: currentFolder === "root" ? [] : ["parent folder path"],
        parent: currentFolder,
        lastAccessed: null,
        updatedAt: new Date(),
      };
      dispatch(createFolder(data));
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
