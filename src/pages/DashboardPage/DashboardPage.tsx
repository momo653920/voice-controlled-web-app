import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/DashboardComponents/NavBar/Navbar";
import SubBar from "../../components/DashboardComponents/SubBar/SubBar";
import HomeComponent from "../../components/DashboardComponents/HomeComponent/HomeComponent";
import CreateFolder from "../../components/DashboardComponents/CreateFolder/CreateFolder";
import {
  getFiles,
  getFolders,
} from "../../redux/actionCreators/fileFoldersActionCreator";
import FolderComponent from "../../components/DashboardComponents/FolderComponent/FolderComponent";
import CreateFile from "../../components/DashboardComponents/CreateFile/CreateFile";
import FileComponent from "../../components/DashboardComponents/FileComponent/FileComponent";
import UploadFile from "../../components/DashboardComponents/UploadFile/UploadFile";
import { RootState } from "../../redux/store";

const DashboardPage: React.FC = () => {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
    shallowEqual
  );
  const user = useSelector((state: RootState) => state.auth.user, shallowEqual);
  const isLoading = useSelector(
    (state: RootState) => state.filefolders.isLoading,
    shallowEqual
  );

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(getFolders(user.uid));
      dispatch(getFiles(user.uid));
    }
  }, [user, dispatch]);

  const showSubBar = !pathname.includes("/file/");

  return (
    <>
      {isCreateFolderModalOpen && (
        <CreateFolder setIsCreateFolderModalOpen={setIsCreateFolderModalOpen} />
      )}
      {isCreateFileModalOpen && (
        <CreateFile setIsCreateFileModalOpen={setIsCreateFileModalOpen} />
      )}
      {isFileUploadModalOpen && (
        <UploadFile setIsFileUploadModalOpen={setIsFileUploadModalOpen} />
      )}
      <Navbar />
      {showSubBar && (
        <SubBar
          setIsCreateFolderModalOpen={setIsCreateFolderModalOpen}
          setIsCreateFileModalOpen={setIsCreateFileModalOpen}
          setIsFileUploadModalOpen={setIsFileUploadModalOpen}
        />
      )}

      <Routes>
        <Route path="" element={<HomeComponent />} />
        <Route path="folder/:folderId" element={<FolderComponent />} />
        <Route path="file/:fileId" element={<FileComponent />} />
      </Routes>
    </>
  );
};

export default DashboardPage;
