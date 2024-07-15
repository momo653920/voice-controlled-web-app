import * as types from "../actionTypes/fileFoldersActionTypes";
import fire from "../../config/firebase";

// Action creators for folders
const addFolder = (folderData, meta) => ({
  type: types.CREATE_FOLDER,
  payload: { data: folderData, meta: meta },
});

const addFolders = (folders) => ({
  type: types.ADD_FOLDERS,
  payload: folders,
});

const setLoading = (isLoading) => ({
  type: types.SET_LOADING,
  payload: isLoading,
});

export const setChangeFolder = (folderId) => ({
  type: types.CHANGE_FOLDER,
  payload: folderId,
});


export const createFolder = (data) => async (dispatch, getState) => {
  try {
    // Validate required fields
    if (!data.createdAt || !data.name || !data.userId || !data.createdBy || !data.updatedAt) {
      throw new Error('Invalid folder data. Missing required fields.');
    }

    // Check if parent folder ID is valid
    if (data.parent !== 'root') { // Assuming 'root' represents the top-level folder
      const parentFolder = getState().filefolders.userFolders.find(folder => folder.docId === data.parent);
      if (!parentFolder) {
        throw new Error('Parent folder not found.'); // Handle this error scenario
      }
    }

    // Add folder to Firestore
    const folderRef = await fire.firestore().collection('folders').add(data);
    const folderId = folderRef.id;
    const folderData = (await folderRef.get()).data();

    // Dispatch action to update Redux state
    dispatch(addFolder(folderData, { docId: folderId }));
    return folderId; // Return folderId if needed
  } catch (error) {
    console.error('Failed to create folder', error);
    throw error;
  }
};
export const getFolders = (userId, parentFolderId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let query = fire.firestore().collection("folders").where("userId", "==", userId);
    if (parentFolderId) {
      query = query.where("parent", "==", parentFolderId);
    }
    const foldersSnapshot = await query.get();

    const foldersData = foldersSnapshot.docs.map((folder) => ({
      data: folder.data(),
      docId: folder.id,
    }));

    dispatch(addFolders(foldersData));
  } catch (error) {
    console.error("Error fetching folders:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Action creator to change the current folder
export const changeFolder = (folderId) => (dispatch) => {
  dispatch(setChangeFolder(folderId));
};

// Action creators for files
const addFiles = (payload) => ({
  type: types.ADD_FILES,
  payload,
});

const addFile = (payload) => ({
  type: types.CREATE_FILE,
  payload,
});

// Thunk action creator to fetch user's files from Firestore
export const getFiles = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const filesSnapshot = await fire
      .firestore()
      .collection("files")
      .where("userId", "==", userId)
      .get();

    const filesData = filesSnapshot.docs.map((file) => ({
      data: file.data(),
      docId: file.id,
    }));

    dispatch(addFiles(filesData));
  } catch (error) {
    console.error("Error fetching files:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk action creator to create a file in Firestore
export const createFile = (data, setSuccess) => async (dispatch) => {
  dispatch(setLoading(true)); // Set loading state to true
  try {
    const fileRef = await fire.firestore().collection("files").add(data);
    const fileId = fileRef.id;
    const fileData = (await fileRef.get()).data();

    dispatch(addFile({ data: fileData, docId: fileId }));
    setSuccess(true);
  } catch (error) {
    console.error('Failed to create file', error);
    setSuccess(false);
  } finally {
    dispatch(setLoading(false)); // Set loading state to false
  }
};
