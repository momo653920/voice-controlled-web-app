import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../DashboardComponents/SubBar/SubBar.css";

interface TrialSubBarProps {
  setIsCreateFileModalOpen: (open: boolean) => void;
}

const TrialSubBar: React.FC<TrialSubBarProps> = ({
  setIsCreateFileModalOpen,
}) => {
  return (
    <nav className="navbar navbar-expand-lg mt-3 navbar-light bg-white py-2">
      <div className="">
        <ul className="navbar-nav">
          <li className="navbar-item">
            <button
              className="btn btn-create-file navbar-button"
              onClick={() => setIsCreateFileModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              <span>Създай файл</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TrialSubBar;
