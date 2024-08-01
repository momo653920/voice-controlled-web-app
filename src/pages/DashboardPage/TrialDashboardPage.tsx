import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../../components/DashboardComponents/NavBar/Navbar";
import TrialCreateFile from "../../components/TrialDashboardComponents/TrialCreateFile";
import TrialHomeComponent from "../../components/TrialDashboardComponents/TrialHomeComponent";
import TrialFileComponent from "../../components/TrialDashboardComponents/TrialFileComponent";

interface Props {
  isCreateFileModalOpen: boolean;
  setIsCreateFileModalOpen: (open: boolean) => void;
  setIsTrial: (isTrial: boolean) => void;
}

const TrialDashboardPage: React.FC<Props> = ({
  isCreateFileModalOpen,
  setIsCreateFileModalOpen,
  setIsTrial,
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    setIsTrial(true);
    return () => setIsTrial(false);
  }, [setIsTrial]);

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
