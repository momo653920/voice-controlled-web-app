import React, { useEffect, useState } from "react";
import TrialShowItems from "./TrialShowItems";
import { getCookie } from "./cookieUtils";

const TrialHomeComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userFiles, setUserFiles] = useState([]);

  useEffect(() => {
    const files = JSON.parse(getCookie("files") || "[]");
    setUserFiles(files);
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
