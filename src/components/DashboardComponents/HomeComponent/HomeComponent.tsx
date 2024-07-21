import React from "react";
import { useSelector } from "react-redux";
import ShowItems from "../ShowItems/ShowItems";
import { selectRootFolders, selectRootFiles } from "../selectors";

const HomeComponent = () => {
  const isLoading = useSelector((state) => state.filefolders.isLoading);
  const userFolders = useSelector(selectRootFolders);
  const userFiles = useSelector(selectRootFiles);

  return (
    <div className="col-md-12 w-100">
      {isLoading ? (
        <h1 className="display-1 my-5 text-center">Loading...</h1>
      ) : (
        <>
          <ShowItems
            title="Created Folders"
            type="folder"
            items={userFolders}
          />
          <ShowItems title="Files" type="files" items={userFiles} />
        </>
      )}
    </div>
  );
};

export default HomeComponent;
