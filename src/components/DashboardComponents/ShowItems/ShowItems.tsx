import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import "./ShowItems.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";

const ShowItems = ({ title, items, type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDoubleClick = (itemId) => {
    if (type === "folder") {
      dispatch(changeFolder(itemId));
      navigate(`/dashboard/folder/${itemId}`);
    } else {
      alert("File clicked");
    }
  };

  return (
    <div className="item-container">
      <h4 className="item-title">{title}</h4>
      <div className="row gap-2 p-4 flex-wrap">
        {items.map((item, index) => (
          <div
            key={index}
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
            <span>{item.data?.name || "Unnamed Item"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowItems;
