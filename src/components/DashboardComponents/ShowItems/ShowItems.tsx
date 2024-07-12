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
    <div className="w-100">
      <h4 className="text-center border-bottom py-2">{title}</h4>
      <div className="row gap-2 p-4 flex-wrap">
        {items.map((item, index) => (
          <div
            key={index}
            className="col-md-2 py-3 text-center d-flex flex-column border"
            onDoubleClick={() => handleDoubleClick(item.docId)}
          >
            {type === "folder" ? (
              <FontAwesomeIcon icon={faFolder} size="4x" className="mb-3" />
            ) : (
              <FontAwesomeIcon icon={faFileAlt} size="4x" className="mb-3" />
            )}
            <span>{item.data?.name || "Unnamed Item"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowItems;
