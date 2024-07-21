// FolderComponent.js
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShowItems from "../ShowItems/ShowItems";
import {
  selectCurrentFolderData,
  selectChildFolders,
  selectChildFiles,
} from "../selectors";

const FolderComponent = () => {
  const { folderId } = useParams();

  const currentFolderData = useSelector((state) =>
    selectCurrentFolderData(state, folderId)
  );
  const childFolders = useSelector((state) =>
    selectChildFolders(state, folderId)
  );
  const childFiles = useSelector((state) => selectChildFiles(state, folderId));

  return (
    <div>
      <>
        {childFolders.length > 0 && (
          <ShowItems
            title="Created Folders"
            type="folder"
            items={childFolders}
          />
        )}

        {childFiles.length > 0 && (
          <ShowItems title="Created Files" type="file" items={childFiles} />
        )}
      </>
    </div>
  );
};

export default FolderComponent;
