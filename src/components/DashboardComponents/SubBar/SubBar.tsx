import React from "react";
import "./SubBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faFileArrowUp,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";

const SubBar = ({ setIsCreateFolderModalOpen }) => {
  return (
    <nav className="navbar navbar-expand-lg mt-3 navbar-light bg-white py-2">
      <p>Root</p>
      <ul className="navbar-nav ms-auto me-5">
        <li className="navbar-item mx-2">
          <button className="btn btn-outline-dark btn-lg">
            <FontAwesomeIcon icon={faFileArrowUp} />
            &nbsp; Upload File
          </button>
        </li>
        <li className="navbar-item mx-2">
          <button className="btn btn-outline-dark btn-lg">
            <FontAwesomeIcon icon={faFileAlt} />
            &nbsp; Create File
          </button>
        </li>
        <li className="navbar-item ms-2">
          <button
            className="btn btn-outline-dark btn-lg"
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
