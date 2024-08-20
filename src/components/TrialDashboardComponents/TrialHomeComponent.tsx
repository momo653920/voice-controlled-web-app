import React, { useEffect, useState } from "react";
import TrialShowItems from "./TrialShowItems";
import { getCookie } from "./cookieUtils";
import "../DashboardComponents/HomeComponent/HomeComponent.css";

const TrialHomeComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userFiles, setUserFiles] = useState<any[]>([]);

  useEffect(() => {
    try {
      const files = JSON.parse(getCookie("files") || "[]");
      setUserFiles(files);
    } catch (error) {
      console.error("Error loading files:", error);
      setUserFiles([]);
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="col-md-12 w-100">
      {isLoading ? (
        <h1 className="display-1 my-5 text-center">Loading...</h1>
      ) : (
        <TrialShowItems title="Files" type="files" items={userFiles} />
      )}
    </div>
  );
};

export default TrialHomeComponent;
