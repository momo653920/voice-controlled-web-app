import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ShowItems from "../ShowItems/ShowItems";
import { createCachedSelector } from "re-reselect"; // Updated import
import { getFolders, getFiles } from "../../../redux/actionCreators/fileFoldersActionCreator";

const selectUserFolders = (state) => state.filefolders.userFolders;
const selectUserFiles = (state) => state.filefolders.userFiles;

const selectFolderData = createCachedSelector(
  [selectUserFolders, selectUserFiles, (_, folderId) => folderId],
  (userFolders, userFiles, folderId) => {
    const currentFolder = userFolders.find(
      (folder) => folder.docId === folderId
    );

    return {
      currentFolderData: currentFolder ? currentFolder.data : null,
      childFolders: userFolders.filter(
        (folder) => folder.data.parent === folderId
      ),
      childFiles: userFiles.filter(
        (file) => file.data.parent === folderId
      ),
    };
  }
)(
  // Provide a cache key function
  (_, folderId) => folderId
);

const FolderComponent = () => {
  const dispatch = useDispatch();
  const { folderId } = useParams();

  const { currentFolderData, childFolders, childFiles } = useSelector((state) =>
    selectFolderData(state, folderId)
  );

  useEffect(() => {
    // Fetch folders and files whenever the component mounts or folderId changes
    dispatch(getFolders(folderId));
    dispatch(getFiles(folderId));
  }, [dispatch, folderId]);

  if (!currentFolderData) {
    return <div>Folder not found</div>;
  }

  return (
    <div>
      {childFolders.length > 0 ? (
        <ShowItems title="Created Folders" type="folder" items={childFolders} />
      ) : (
        <p className="text-center my-5">No Child Folders</p>
      )}
      {childFiles.length > 0 ? (
        <ShowItems title="Created Files" type="file" items={childFiles} />
      ) : (
        <p className="text-center my-5">No Child Files</p>
      )}
    </div>
  );
};

export default FolderComponent;
