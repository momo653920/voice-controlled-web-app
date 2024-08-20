import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import TrialCreateFile from "../../components/TrialDashboardComponents/TrialCreateFile";
import TrialHomeComponent from "../../components/TrialDashboardComponents/TrialHomeComponent";
import TrialFileComponent from "../../components/TrialDashboardComponents/TrialFileComponent";
import Navigation from "../../components/HomePageComponents/Navigation";
import TrialSubBar from "../../components/TrialDashboardComponents/TrialSubBar";
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
      <Navigation />
      {showSubBar && (
        <TrialSubBar setIsCreateFileModalOpen={setIsCreateFileModalOpen} />
      )}
      <Routes>
        <Route path="" element={<TrialHomeComponent />} />
        <Route path="file/:fileId" element={<TrialFileComponent />} />
      </Routes>
    </>
  );
};

export default TrialDashboardPage;
