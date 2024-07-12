import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShowItems from "../ShowItems/ShowItems";

const FolderComponent = () => {
  const { folderId } = useParams();

  const { currentFolderData, childFolders } = useSelector((state) => {
    const currentFolder = state.filefolders.userFolders.find(
      (folder) => folder.docId === folderId
    );

    return {
      currentFolderData: currentFolder ? currentFolder.data : null,
      childFolders: state.filefolders.userFolders.filter(
        (folder) => folder.data.parent === folderId
      ),
    };
  }, shallowEqual);

  // Memoize currentFolderData and childFolders
  const memoizedCurrentFolderData = useMemo(
    () => currentFolderData,
    [currentFolderData]
  );
  const memoizedChildFolders = useMemo(() => childFolders, [childFolders]);

  if (!memoizedCurrentFolderData) {
    return <div>Folder not found</div>;
  }

  return (
    <div>
      {memoizedChildFolders.length > 0 ? (
        <ShowItems
          title="Child Folders"
          type="folder"
          items={memoizedChildFolders}
        />
      ) : (
        <p className="text-center my-5">Empty Folder</p>
      )}
    </div>
  );
};

export default FolderComponent;
