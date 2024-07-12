import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import createCachedSelector from "re-reselect";
import ShowItems from "../ShowItems/ShowItems";

const selectUserFolders = (state) => state.filefolders.userFolders;

const selectFolderData = createCachedSelector(
  [selectUserFolders, (_, folderId) => folderId],
  (userFolders, folderId) => {
    const currentFolder = userFolders.find(
      (folder) => folder.docId === folderId
    );

    return {
      currentFolderData: currentFolder ? currentFolder.data : null,
      childFolders: userFolders.filter(
        (folder) => folder.data.parent === folderId
      ),
    };
  }
)(
  // Provide a cache key function
  (_, folderId) => folderId
);

const FolderComponent = () => {
  const { folderId } = useParams();

  const { currentFolderData, childFolders } = useSelector((state) =>
    selectFolderData(state, folderId)
  );

  if (!currentFolderData) {
    return <div>Folder not found</div>;
  }

  return (
    <div>
      {childFolders.length > 0 ? (
        <ShowItems title="Child Folders" type="folder" items={childFolders} />
      ) : (
        <p className="text-center my-5">Empty Folder</p>
      )}
    </div>
  );
};

export default FolderComponent;
