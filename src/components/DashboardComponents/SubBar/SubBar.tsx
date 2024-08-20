import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowUp,
  faPlus,
  faArrowLeft,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { changeFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";
import "./SubBar.css";
interface SubBarProps {
  setIsCreateFolderModalOpen: (open: boolean) => void;
  setIsCreateFileModalOpen: (open: boolean) => void;
  setIsFileUploadModalOpen: (open: boolean) => void;
}

const SubBar: React.FC<SubBarProps> = ({
  setIsCreateFolderModalOpen,
  setIsCreateFileModalOpen,
  setIsFileUploadModalOpen,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFolder, currentFolderData, userFolders } = useSelector(
    (state) => ({
      currentFolder: state.filefolders.currentFolder,
      currentFolderData: state.filefolders.userFolders.find(
        (folder) => folder.docId === state.filefolders.currentFolder
      ),
      userFolders: state.filefolders.userFolders,
    }),
    shallowEqual
  );

  const handleNavigate = (link: string, id: string) => {
    navigate(link);
    dispatch(changeFolder(id));
  };

  const handleBack = () => {
    if (currentFolderData?.data.path.length > 0) {
      const parentFolderId =
        currentFolderData.data.path[currentFolderData.data.path.length - 1];
      const parentFolder = userFolders.find(
        (fldr) => fldr.docId === parentFolderId
      );
      if (parentFolder) {
        handleNavigate(
          `/dashboard/folder/${parentFolder.docId}`,
          parentFolder.docId
        );
      }
    } else {
      handleNavigate("/dashboard", "root");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg mt-3 navbar-light bg-white py-2">
        <div className="navbar-buttons ms-2">
          <ul className="navbar-nav">
            <li className="navbar-item">
              <button
                className="btn btn-create-file navbar-button"
                onClick={() => setIsCreateFileModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="icon" />
                <span>Създай Файл</span>
              </button>
            </li>
            <li className="navbar-item">
              <button
                className="btn btn-upload navbar-button"
                onClick={() => setIsFileUploadModalOpen(true)}
              >
                <FontAwesomeIcon icon={faFileArrowUp} className="icon" />
                <span>Качи Файл</span>
              </button>
            </li>
            <li className="navbar-item">
              <button
                className="btn btn-create-folder navbar-button"
                onClick={() => setIsCreateFolderModalOpen(true)}
              >
                <FontAwesomeIcon icon={faFolderPlus} className="icon" />
                <span>Създай Папка</span>
              </button>
            </li>
            {currentFolder !== "root" && (
              <li className="navbar-item go-back-button">
                <button
                  className="btn btn-outline-dark btn-lg navbar-button"
                  onClick={handleBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="icon" />
                  <span>Назад</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <nav>
        <div className="folder-name ms-2">
          <span>{currentFolderData?.data.name || "Начало"}</span>
        </div>
      </nav>
    </>
  );
};

export default SubBar;
