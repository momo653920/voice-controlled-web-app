import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import ShowItems from "../ShowItems/ShowItems";

const HomeComponent = () => {
  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.filefolders.isLoading,
    }),
    shallowEqual
  );

  const userFolders = useSelector(
    (state) =>
      state.filefolders.userFolders.filter(
        (folder) => folder.data.parent === "root"
      ),
    shallowEqual
  );

  const userFiles = useSelector(
    (state) =>
      state.filefolders.userFiles.filter(
        (file) => file.data.parent === "root"
      ),
    shallowEqual
  );

  return (
    <div className="col-md-12 w-100">
      {isLoading ? (
        <h1 className="display-1 my-5 text-center">Loading...</h1>
      ) : (
        <>
          <ShowItems title="Created Folders" type="folder" items={userFolders} />
          <ShowItems title="Created Files" type="files" items={userFiles} />
        </>
      )}
    </div>
  );
};

export default HomeComponent;
