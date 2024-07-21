import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  fileName: string;
  lastModified: Date;
}

const Header: React.FC<HeaderProps> = ({ fileName, lastModified }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mt-1">
      <div className="container-fluid">
        <p className="navbar-brand my-0 fw-bold ms-5">{fileName}</p>
        <p className="navbar-text ms-3 text-muted">
          Last Modified: {lastModified.toLocaleString()}
        </p>
        <ul className="navbar-nav ms-auto me-5">
          <li className="nav-item">
            <button className="btn btn-dark" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeftLong} /> Go Back
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
