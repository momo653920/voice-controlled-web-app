// selectors.js
import { createSelector } from "reselect";

const selectUserFolders = (state) => state.filefolders.userFolders;
const selectUserFiles = (state) => state.filefolders.userFiles;

export const selectCurrentFolderData = createSelector(
  [selectUserFolders, (state, folderId) => folderId],
  (userFolders, folderId) =>
    userFolders.find((folder) => folder.docId === folderId)?.data
);

export const selectChildFolders = createSelector(
  [selectUserFolders, (state, folderId) => folderId],
  (userFolders, folderId) =>
    userFolders.filter((folder) => folder.data.parent === folderId)
);

export const selectChildFiles = createSelector(
  [selectUserFiles, (state, folderId) => folderId],
  (userFiles, folderId) =>
    userFiles.filter((file) => file.data.parent === folderId)
);

export const selectRootFolders = createSelector(
  [selectUserFolders],
  (userFolders) => userFolders.filter((folder) => folder.data.parent === "root")
);

export const selectRootFiles = createSelector([selectUserFiles], (userFiles) =>
  userFiles.filter((file) => file.data.parent === "root")
);
