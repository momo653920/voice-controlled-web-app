import * as types from "../actionTypes/fileFoldersActionTypes";
import fire from "../../config/firebase";
import { Dispatch } from "redux";

interface CreateFolderAction {
  type: typeof types.CREATE_FOLDER;
  payload: { data: any; docId: string };
}

interface AddFoldersAction {
  type: typeof types.ADD_FOLDERS;
  payload: { data: any; docId: string }[];
}

interface SetLoadingAction {
  type: typeof types.SET_LOADING;
  payload: boolean;
}

interface ChangeFolderAction {
  type: typeof types.CHANGE_FOLDER;
  payload: string;
}

interface AddFilesAction {
  type: typeof types.ADD_FILES;
  payload: { data: any; docId: string }[];
}

interface CreateFileAction {
  type: typeof types.CREATE_FILE;
  payload: { data: any; docId: string };
}

interface SetFileDataAction {
  type: typeof types.SET_FILE_DATA;
  payload: { fileId: string; data: any; updatedAt: Date };
}

type FileFoldersActionTypes =
  | CreateFolderAction
  | AddFoldersAction
  | SetLoadingAction
  | ChangeFolderAction
  | AddFilesAction
  | CreateFileAction
  | SetFileDataAction;

const addFolder = (payload: {
  data: any;
  docId: string;
}): CreateFolderAction => ({
  type: types.CREATE_FOLDER,
  payload,
});

const addFolders = (
  payload: { data: any; docId: string }[]
): AddFoldersAction => ({
  type: types.ADD_FOLDERS,
  payload,
});

const setLoading = (payload: boolean): SetLoadingAction => ({
  type: types.SET_LOADING,
  payload,
});

const setChangeFolder = (payload: string): ChangeFolderAction => ({
  type: types.CHANGE_FOLDER,
  payload,
});

const addFiles = (payload: { data: any; docId: string }[]): AddFilesAction => ({
  type: types.ADD_FILES,
  payload,
});

const addFile = (payload: { data: any; docId: string }): CreateFileAction => ({
  type: types.CREATE_FILE,
  payload,
});

const setFileData = (payload: {
  fileId: string;
  data: any;
  updatedAt: Date;
}): SetFileDataAction => ({
  type: types.SET_FILE_DATA,
  payload,
});

export const createFolder =
  (data: any) => async (dispatch: Dispatch<FileFoldersActionTypes>) => {
    try {
      const folderRef = await fire.firestore().collection("folders").add(data);
      const folderData = await (await folderRef.get()).data();
      const folderId = folderRef.id;
      dispatch(addFolder({ data: folderData, docId: folderId }));
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

export const getFolders =
  (userId: string) => async (dispatch: Dispatch<FileFoldersActionTypes>) => {
    dispatch(setLoading(true));
    try {
      const foldersSnapshot = await fire
        .firestore()
        .collection("folders")
        .where("userId", "==", userId)
        .get();
      const foldersData = foldersSnapshot.docs.map((folder) => ({
        data: folder.data(),
        docId: folder.id,
      }));
      dispatch(setLoading(false));
      dispatch(addFolders(foldersData));
    } catch (error) {
      console.error("Error getting folders:", error);
    }
  };

export const changeFolder =
  (folderId: string) => (dispatch: Dispatch<FileFoldersActionTypes>) => {
    dispatch(setChangeFolder(folderId));
  };

export const getFiles =
  (userId: string) => async (dispatch: Dispatch<FileFoldersActionTypes>) => {
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
      console.error("Error getting files:", error);
    }
  };

export const createFile =
  (data: any, setSuccess: (success: boolean) => void) =>
  async (dispatch: Dispatch<FileFoldersActionTypes>) => {
    try {
      const fileRef = await fire.firestore().collection("files").add(data);
      const fileData = await (await fileRef.get()).data();
      const fileId = fileRef.id;
      dispatch(addFile({ data: fileData, docId: fileId }));
      setSuccess(true);
    } catch (error) {
      console.error("Error creating file:", error);
      setSuccess(false);
    }
  };

export const updateFileData =
  (fileId: string, data: any) =>
  async (dispatch: Dispatch<FileFoldersActionTypes>) => {
    try {
      const updatedAt = new Date();
      await fire.firestore().collection("files").doc(fileId).update({
        data,
        updatedAt,
      });
      dispatch(setFileData({ fileId, data, updatedAt }));
    } catch (error) {
      console.error("Error updating file data:", error);
      alert("Error saving file");
    }
  };

export const uploadFile =
  (file: File, data: any, setSuccess: (success: boolean) => void) =>
  (dispatch: Dispatch<FileFoldersActionTypes>) => {
    const uploadFileRef = fire
      .storage()
      .ref(`files/${data.userId}/${data.name}`);
    uploadFileRef.put(file).on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      async () => {
        try {
          const fileUrl = await uploadFileRef.getDownloadURL();
          const fullData = { ...data, url: fileUrl };
          const fileRef = await fire
            .firestore()
            .collection("files")
            .add(fullData);
          const fileData = await (await fileRef.get()).data();
          const fileId = fileRef.id;
          dispatch(addFile({ data: fileData, docId: fileId }));
          setSuccess(true);
        } catch (error) {
          console.error("Error completing file upload:", error);
          setSuccess(false);
        }
      }
    );
  };

export const deleteFolder =
  (folderId: string) => async (dispatch: Dispatch<FileFoldersActionTypes>) => {
    try {
      const subfoldersSnapshot = await fire
        .firestore()
        .collection("folders")
        .where("parent", "==", folderId)
        .get();
      const subfolders = subfoldersSnapshot.docs.map((doc) => doc.id);

      const filesSnapshot = await fire
        .firestore()
        .collection("files")
        .where("parent", "==", folderId)
        .get();
      const files = filesSnapshot.docs.map((doc) => doc.id);

      // Delete files and subfolders recursively
      for (const subfolderId of subfolders) {
        await dispatch(deleteFolder(subfolderId));
      }

      for (const fileId of files) {
        await dispatch(deleteFile(fileId));
      }

      await fire.firestore().collection("folders").doc(folderId).delete();

      dispatch({
        type: types.DELETE_FOLDER_SUCCESS,
        payload: folderId,
      });
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

export const deleteFile =
  (fileId: string) => async (dispatch: Dispatch<FileFoldersActionTypes>) => {
    try {
      await fire.firestore().collection("files").doc(fileId).delete();

      dispatch({
        type: types.DELETE_FILE_SUCCESS,
        payload: fileId,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
interface FetchFileByNameAction {
  type: typeof types.FETCH_FILE_BY_NAME_SUCCESS;
  payload: { data: any; docId: string };
}

export const fetchFileByName =
  (fileName: string) => async (dispatch: Dispatch) => {
    try {
      const filesSnapshot = await fire
        .firestore()
        .collection("files")
        .where("name", "==", fileName)
        .limit(1)
        .get();

      if (!filesSnapshot.empty) {
        const fileDoc = filesSnapshot.docs[0];
        const fileData = fileDoc.data();
        const docId = fileDoc.id;

        dispatch({
          type: types.FETCH_FILE_BY_NAME_SUCCESS,
          payload: { data: fileData, docId },
        });

        return docId;
      } else {
        console.error("File not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching file by name:", error);
      return null;
    }
  };
interface FetchFolderByIdAction {
  type: typeof types.FETCH_FOLDER_BY_ID_SUCCESS;
  payload: { data: any; docId: string };
}

export const fetchFolderById =
  (folderId: string) => async (dispatch: Dispatch) => {
    try {
      const folderDoc = await fire
        .firestore()
        .collection("folders")
        .doc(folderId)
        .get();

      if (folderDoc.exists) {
        const folderData = folderDoc.data();
        const docId = folderDoc.id;

        dispatch({
          type: types.FETCH_FOLDER_BY_ID_SUCCESS,
          payload: { data: folderData, docId },
        });

        return docId;
      } else {
        console.error("Folder not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching folder by ID:", error);
      return null;
    }
  };
