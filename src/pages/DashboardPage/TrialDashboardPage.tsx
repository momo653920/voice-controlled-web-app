import React, { useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import Navbar from "../../components/DashboardComponents/NavBar/Navbar";
import TrialCreateFile from "../../components/TrialDashboardComponents/TrialCreateFile";
import TrialHomeComponent from "../../components/TrialDashboardComponents/TrialHomeComponent";
import TrialFileComponent from "../../components/TrialDashboardComponents/TrialFileComponent";

const TrialDashboardPage: React.FC = () => {
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);
  const { pathname } = useLocation();

  const showSubBar = !pathname.includes("/file/");

  return (
    <>
      {isCreateFileModalOpen && (
        <TrialCreateFile setIsCreateFileModalOpen={setIsCreateFileModalOpen} />
      )}
      <Navbar />
      {showSubBar && (
        <nav className="navbar navbar-expand-lg mt-3 navbar-light bg-white py-2">
          <ul className="navbar-nav ms-auto me-5">
            <li className="navbar-item mx-2">
              <button
                className="btn btn-outline-dark btn-lg navbar-button"
                onClick={() => setIsCreateFileModalOpen(true)}
              >
                Create File
              </button>
            </li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="" element={<TrialHomeComponent />} />
        <Route path="file/:fileId" element={<TrialFileComponent />} />
      </Routes>
    </>
  );
};

export default TrialDashboardPage;
