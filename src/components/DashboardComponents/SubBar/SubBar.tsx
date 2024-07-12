import React from "react";
import "./SubBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faFileArrowUp,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";

const SubBar = ({ setIsCreateFolderModalOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFolder, userFolders, currentFolderData } = useSelector(
    (state) => ({
      currentFolder: state.filefolders.currentFolder,
      currentFolderData: state.filefolders.userFolders.find(
        (folder) => folder.docId === state.filefolders.currentFolder
      ),
      userFolders: state.filefolders.userFolders,
    }),
    // Shallow equality check for performance optimization
    (prev, next) =>
      prev.currentFolder === next.currentFolder &&
      prev.currentFolderData === next.currentFolderData &&
      prev.userFolders === next.userFolders
  );

  const handleNavigate = (link, id) => {
    navigate(link);
    dispatch(changeFolder(id));
  };

  const renderBreadcrumb = () => {
    if (currentFolder === "root") {
      return <li className="breadcrumb-item active">Home</li>;
    } else {
      const path = currentFolderData?.data.path || [];
      return (
        <>
          <button
            onClick={() => handleNavigate("/dashboard", "root")}
            className="breadcrumb-item text-decoration-none"
          >
            Home
          </button>
          {path.map((folderId, index) => (
            <button
              key={index}
              className="breadcrumb-item folder text-decoration-none"
              onClick={() =>
                handleNavigate(
                  `/dashboard/folder/${userFolders.find((fldr) => folderId === fldr.docId).docId}`,
                  folderId
                )
              }
            >
              {userFolders.find((fldr) => folderId === fldr.docId)?.data.name}
            </button>
          ))}
          <li className="breadcrumb-item active">
            {" "}
            {currentFolderData?.data.name}
          </li>
        </>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg mt-3 navbar-light bg-white py-2">
      <nav className="ms-5" aria-label="breadcrumb">
        <ol className="breadcrumb d-flex align-items-center">
          {renderBreadcrumb()}
        </ol>
      </nav>

      <ul className="navbar-nav ms-auto me-5">
        <li className="navbar-item mx-2">
          <button className="btn btn-outline-dark btn-lg navbar-button">
            <FontAwesomeIcon icon={faFileArrowUp} />
            &nbsp; Upload File
          </button>
        </li>
        <li className="navbar-item mx-2">
          <button className="btn btn-outline-dark btn-lg navbar-button">
            <FontAwesomeIcon icon={faFileAlt} />
            &nbsp; Create File
          </button>
        </li>
        <li className="navbar-item ms-2">
          <button
            className="btn btn-outline-dark btn-lg navbar-button"
            onClick={() => setIsCreateFolderModalOpen(true)}
          >
            <FontAwesomeIcon icon={faFolderPlus} />
            &nbsp; Create Folder
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SubBar;
