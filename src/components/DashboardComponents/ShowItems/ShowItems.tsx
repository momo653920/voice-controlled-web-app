import React, { useState, useEffect, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFileAlt,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileVideo,
  faFileAudio,
  faFileCode,
  faFileText,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  changeFolder,
  deleteFile,
  deleteFolder,
} from "../../../redux/actionCreators/fileFoldersActionCreator";
import "./ShowItems.css";
import ConfirmationModal from "./ConfirmationModal";

interface ItemData {
  name: string;
  extension?: string;
  itemsCount?: number;
  url?: string;
}

interface Item {
  docId: string;
  data: ItemData;
}

interface ShowItemsProps {
  title: string;
  items: Item[];
  type: "folder" | "files";
}

const ShowItems: React.FC<ShowItemsProps> = ({ title, items = [], type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".item")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDoubleClick = (itemId: string) => {
    if (type === "folder") {
      dispatch(changeFolder(itemId));
      navigate(`/dashboard/folder/${itemId}`);
    } else {
      navigate(`/dashboard/file/${itemId}`);
    }
  };

  const handleDotsClick = (event: React.MouseEvent, itemId: string) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === itemId ? null : itemId);
  };

  const confirmDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setConfirmModalOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      if (type === "folder") {
        dispatch(deleteFolder(itemToDelete));
      } else {
        dispatch(deleteFile(itemToDelete));
      }
    }
    setConfirmModalOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmModalOpen(false);
    setItemToDelete(null);
  };

  const getFileIcon = (extension: string | undefined) => {
    const fileTypeIcons = {
      pdf: faFilePdf,
      jpg: faFileImage,
      jpeg: faFileImage,
      png: faFileImage,
      gif: faFileImage,
      doc: faFileWord,
      docx: faFileWord,
      xls: faFileExcel,
      xlsx: faFileExcel,
      ppt: faFilePowerpoint,
      pptx: faFilePowerpoint,
      mp4: faFileVideo,
      mkv: faFileVideo,
      avi: faFileVideo,
      mp3: faFileAudio,
      wav: faFileAudio,
      html: faFileCode,
      css: faFileCode,
      js: faFileCode,
      json: faFileCode,
      txt: faFileText,
    };

    return (
      <FontAwesomeIcon
        icon={fileTypeIcons[extension?.toLowerCase()] || faFileAlt}
        size="4x"
        className="item-icon"
      />
    );
  };

  const handleDownload = async (url: string | undefined, fileName: string) => {
    if (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const fileContent = await response.text();
        const blob = new Blob([fileContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  };

  return (
    <div className="item-container">
      <h4 className="item-title">{title}</h4>
      <div className="row gap-2 p-4 flex-wrap">
        {items.map((item) => (
          <div
            key={item.docId}
            className="col-md-2 py-3 text-center d-flex flex-column border item"
            onDoubleClick={() => handleDoubleClick(item.docId)}
          >
            {type === "folder" ? (
              <FontAwesomeIcon
                icon={faFolder}
                size="4x"
                className="item-icon"
              />
            ) : (
              getFileIcon(item.data.extension)
            )}
            <FontAwesomeIcon
              icon={faEllipsisH}
              className="item-dots"
              onClick={(e) => handleDotsClick(e, item.docId)}
            />
            <div
              className={`dropdown-menu ${dropdownOpen === item.docId ? "show" : ""}`}
            >
              {type === "files" && item.data.url && (
                <button
                  className="dropdown-item download-btn"
                  onClick={() => handleDownload(item.data.url, item.data.name)}
                >
                  Download
                </button>
              )}
              <button
                className="dropdown-item"
                onClick={() => confirmDelete(item.docId)}
              >
                Delete
              </button>
            </div>
            <p className={`item-name ${item.data.name}`}>{item.data.name}</p>
            {type === "folder" && item.data.itemsCount !== undefined && (
              <p className="items-count">{item.data.itemsCount} items</p>
            )}
          </div>
        ))}
      </div>
      <ConfirmationModal
        show={confirmModalOpen}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
};

export default ShowItems;
