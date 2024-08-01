import * as types from "../actionTypes/fileFoldersActionTypes";
import { FileFoldersActionTypes } from "../actionTypes/fileFoldersActionTypes";

interface FileFoldersState {
  isLoading: boolean;
  currentFolder: string;
  userFolders: any[];
  userFiles: any[];
}

const initialState: FileFoldersState = {
  isLoading: true,
  currentFolder: "root",
  userFolders: [],
  userFiles: [],
};

const FileFoldersReducer = (
  state = initialState,
  action: FileFoldersActionTypes
): FileFoldersState => {
  switch (action.type) {
    case types.CREATE_FOLDER:
      return {
        ...state,
        userFolders: [...state.userFolders, action.payload],
      };
    case types.ADD_FOLDERS:
      return {
        ...state,
        userFolders: action.payload,
      };
    case types.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case types.CHANGE_FOLDER:
      return {
        ...state,
        currentFolder: action.payload,
      };
    case types.CREATE_FILE:
      return {
        ...state,
        userFiles: [...state.userFiles, action.payload],
      };
    case types.ADD_FILES:
      return {
        ...state,
        userFiles: action.payload,
      };
    case types.SET_FILE_DATA:
      const { fileId, data, updatedAt } = action.payload;
      return {
        ...state,
        userFiles: state.userFiles.map((file) =>
          file.docId === fileId
            ? { ...file, data: { ...file.data, data }, updatedAt }
            : file
        ),
      };
    case types.DELETE_FOLDER_SUCCESS:
      return {
        ...state,
        userFolders: state.userFolders.filter(
          (folder) => folder.docId !== action.payload
        ),
      };
    case types.DELETE_FILE_SUCCESS:
      return {
        ...state,
        userFiles: state.userFiles.filter(
          (file) => file.docId !== action.payload
        ),
      };
    case types.FETCH_FILE_BY_NAME_SUCCESS:
      return {
        ...state,
        files: state.files.map((file) =>
          file.docId === action.payload.docId ? action.payload.data : file
        ),
      };
    case types.FETCH_FOLDER_BY_ID_SUCCESS:
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.docId === action.payload.docId ? action.payload.data : folder
        ),
      };
    default:
      return state;
  }
};

export default FileFoldersReducer;
