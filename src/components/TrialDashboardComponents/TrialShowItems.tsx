import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileText, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "./cookieUtils";
import ConfirmationModal from "../DashboardComponents/ShowItems/ConfirmationModal";
import "../DashboardComponents/ShowItems/ShowItems.css";
interface ItemData {
  id: string;
  name: string;
  content: string;
}

interface Item {
  docId: string;
  data: ItemData;
}

const TrialShowItems: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const files = JSON.parse(getCookie("files") || "[]").map((file: any) => ({
      docId: file.id,
      data: file,
    }));
    setItems(files);

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
    navigate(`/trial/file/${itemId}`);
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
      const existingFiles = JSON.parse(getCookie("files") || "[]");
      const updatedFiles = existingFiles.filter(
        (file: Item) => file.id !== itemToDelete
      );
      setCookie("files", JSON.stringify(updatedFiles));
      setConfirmModalOpen(false);
      setItemToDelete(null);
      setItems(items.filter((item) => item.docId !== itemToDelete));
    }
  };

  const cancelDelete = () => {
    setConfirmModalOpen(false);
    setItemToDelete(null);
  };

  const handleDownload = async (content: string, fileName: string) => {
    try {
      const blob = new Blob([content], { type: "text/plain" });
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
  };

  return (
    <div className="item-container">
      <h4 className="item-title">Файлове</h4>
      <div className="row gap-2 p-4 flex-wrap">
        {items.map((item) => (
          <div
            key={item.docId}
            className="col-md-2 py-3 text-center d-flex flex-column border item"
            onDoubleClick={() => handleDoubleClick(item.docId)}
          >
            <FontAwesomeIcon
              icon={faFileText}
              size="4x"
              className="item-icon"
            />
            <FontAwesomeIcon
              icon={faEllipsisH}
              className="item-dots"
              onClick={(e) => handleDotsClick(e, item.docId)}
            />
            <div
              className={`dropdown-menu ${dropdownOpen === item.docId ? "show" : ""}`}
            >
              <button
                className="dropdown-item download-btn"
                onClick={() =>
                  handleDownload(item.data.content, item.data.name)
                }
              >
                Download
              </button>
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

export default TrialShowItems;
