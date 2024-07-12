import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/DashboardComponents/NavBar/Navbar";
import SubBar from "../../components/DashboardComponents/SubBar/SubBar";
import HomeComponent from "../../components/DashboardComponents/HomeComponent/HomeComponent";
import CreateFolder from "../../components/DashboardComponents/CreateFolder/CreateFolder";

const DashboardPage = () => {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      console.log(isLoggedIn);
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {isCreateFolderModalOpen && (
        <CreateFolder setIsCreateFolderModalOpen={setIsCreateFolderModalOpen} />
      )}
      <Navbar />
      <SubBar setIsCreateFolderModalOpen={setIsCreateFolderModalOpen} />
      <HomeComponent />
    </>
  );
};

export default DashboardPage;
