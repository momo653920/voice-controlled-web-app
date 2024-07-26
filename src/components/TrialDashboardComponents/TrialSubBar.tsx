import "./SubBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

const TrialSubBar = ({ setIsCreateFileModalOpen }) => {
  return (
    <nav className="navbar navbar-expand-lg mt-3 navbar-light bg-white py-2">
      <ul className="navbar-nav ms-auto me-5">
        <li className="navbar-item mx-2">
          <button
            className="btn btn-outline-dark btn-lg navbar-button"
            onClick={() => setIsCreateFileModalOpen(true)}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            &nbsp; Create File
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TrialSubBar;
