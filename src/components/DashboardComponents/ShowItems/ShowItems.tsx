import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFileAlt,
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

const ShowItems = ({ title, items = [], type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".item")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDoubleClick = (itemId) => {
    if (type === "folder") {
      dispatch(changeFolder(itemId));
      navigate(`/dashboard/folder/${itemId}`);
    } else {
      navigate(`/dashboard/file/${itemId}`);
    }
  };

  const handleDotsClick = (event, itemId) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === itemId ? null : itemId);
  };

  const confirmDelete = (itemId) => {
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
              <FontAwesomeIcon
                icon={faFileAlt}
                size="4x"
                className="item-icon"
              />
            )}
            <FontAwesomeIcon
              icon={faEllipsisH}
              className="item-dots"
              onClick={(e) => handleDotsClick(e, item.docId)}
            />
            <div
              className={`dropdown-menu ${dropdownOpen === item.docId ? "show" : ""}`}
            >
              <button
                className="dropdown-item"
                onClick={() => confirmDelete(item.docId)}
              >
                Delete
              </button>
            </div>
            <p className={`item-name ${item.data.name}`}>{item.data.name}</p>
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
