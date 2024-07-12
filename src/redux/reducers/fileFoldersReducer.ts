import * as types from "../actionTypes/fileFoldersActionTypes";

const initialState = {
  isLoading: false,
  currentFolder: "root",
  userFolders: [],
  userFiles: [],
  adminFolders: [],
  adminFiles: [],
};

const FileFoldersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_FOLDER:
      return { ...state, userFolders: [...state.userFolders, action.payload] };

    default:
      return state;
  }
};

export default FileFoldersReducer;
