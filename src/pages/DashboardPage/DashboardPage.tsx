import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createSelector } from "reselect";
import Navbar from "../../components/DashboardComponents/NavBar/Navbar";
import SubBar from "../../components/DashboardComponents/SubBar/SubBar";
import HomeComponent from "../../components/DashboardComponents/HomeComponent/HomeComponent";
import CreateFolder from "../../components/DashboardComponents/CreateFolder/CreateFolder";
import { getFiles, getFolders } from "../../redux/actionCreators/fileFoldersActionCreator";
import FolderComponent from "../../components/DashboardComponents/FolderComponent/FolderComponent";
import CreateFile from "../../components/DashboardComponents/CreateFile/CreateFile";

// Define the state and user types
interface AuthState {
  isAuthenticated: boolean;
  user: {
    uid: string;
  } | null;
}

interface FileFoldersState {
  isLoading: boolean;
  userFolders: any[];
  userFiles: any[];
}

interface RootState {
  auth: AuthState;
  filefolders: FileFoldersState;
}

// Create selectors
const selectAuthState = (state: RootState) => state.auth;
const selectFileFoldersState = (state: RootState) => state.filefolders;

const selectIsLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);
const selectUser = createSelector(selectAuthState, (auth) => auth.user);
const selectIsLoading = createSelector(
  selectFileFoldersState,
  (filefolders) => filefolders.isLoading
);

const DashboardPage = () => {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn, shallowEqual);
  const user = useSelector(selectUser, shallowEqual);
  const isLoading = useSelector(selectIsLoading, shallowEqual);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(getFolders(user.uid));
      dispatch(getFiles(user.uid));
    }
  }, [user, dispatch]);

  return (
    <>
      {isCreateFolderModalOpen && (
        <CreateFolder setIsCreateFolderModalOpen={setIsCreateFolderModalOpen} />
      )}
      {isCreateFileModalOpen && (
        <CreateFile setIsCreateFileModalOpen={setIsCreateFileModalOpen} />
      )}
      <Navbar />
      <SubBar setIsCreateFolderModalOpen={setIsCreateFolderModalOpen}
       setIsCreateFileModalOpen={setIsCreateFileModalOpen} />
      <Routes>
        <Route path="" element={<HomeComponent />} />
        <Route path="folder/:folderId" element={<FolderComponent />} />
      </Routes>
    </>
  );
};

export default DashboardPage;
