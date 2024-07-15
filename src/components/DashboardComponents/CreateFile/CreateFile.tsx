import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createFile } from "../../../redux/actionCreators/fileFoldersActionCreator";

const CreateFile = ({ setIsCreateFileModalOpen }) => {
  let [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [success, setSuccess] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const { userFiles, user, currentFolder } = useSelector(
    (state) => ({
      userFiles: state.filefolders.userFiles || [],
      user: state.auth.user,
      currentFolder: state.filefolders.currentFolder,
    }),
    shallowEqual
  );

  const currentFolderData = useMemo(() => {
    if (currentFolder === 'root') {
      return { data: { path: [] } };
    }
    const folder = userFiles.find(file => file.docId === currentFolder);
    return folder ? folder : { data: { path: [] } };
  }, [currentFolder, userFiles]);

  const checkFileAlreadyPresent = (name, extension) => {
    const baseName = name.split(".").slice(0, -1).join(".");
    return userFiles.some((file) => 
      file.data.parent === currentFolder && file.data.name === name && file.data.extension === extension
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      setError("File name cannot be empty");
      return;
    }
  
    let extension = "";
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      extension = fileName.slice(lastDotIndex + 1);
      if (!extension) {
        setError("Invalid file name. Please provide a valid file name with extension.");
        return;
      }
    } else {
      // Default extension if none provided
      fileName = fileName + ".txt";
      extension = "txt";
    }
  
    if (checkFileAlreadyPresent(fileName, extension)) {
      setError("File already exists with the same name and extension.");
      return;
    }
  
    const path = currentFolderData.data.path ? [...currentFolderData.data.path, currentFolder] : [currentFolder];
  
    const data = {
      createdAt: new Date(),
      name: fileName,
      userId: user.uid,
      createdBy: user.displayName,
      path: path,
      parent: currentFolder,
      lastAccessed: null,
      updatedAt: new Date(),
      extension: extension,
      data: "",
      url: null,
    };
  
    setIsLoading(true); // Set loading to true before dispatching action
    try {
      await dispatch(createFile(data, setSuccess));
    } catch (error) {
      setError("Failed to create file. Please try again later.");
      console.error("Error creating file:", error);
    } finally {
      setIsLoading(false); // Set loading to false after action is complete
    }
  };
  
  
  
  

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsCreateFileModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (success) {
      setFileName("");
      setSuccess(false);
      setIsCreateFileModalOpen(false);
    }
  }, [success]);

  useEffect(() => {
    console.log("currentFolder:", currentFolder);
    console.log("userFiles:", userFiles);
    console.log("currentFolderData:", currentFolderData);
  }, [currentFolder, userFiles, currentFolderData]);

  return (
    <div className="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: "rgba(0,0,0,0.4)", zIndex: 9999 }}>
      <div ref={modalRef} className="bg-white p-4 rounded shadow" style={{ maxWidth: "600px", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Create File</h4>
          <button className="btn" onClick={() => setIsCreateFileModalOpen(false)}>
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
              id="fileName"
              placeholder="File Name"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                setError("");
              }}
              disabled={isLoading} // Disable input when loading
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create File"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFile;
