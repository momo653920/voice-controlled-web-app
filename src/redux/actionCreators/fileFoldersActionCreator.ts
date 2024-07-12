import * as types from "../actionTypes/fileFoldersActionTypes";

const addFolder = (payload) => {
  return {
    type: types.CREATE_FOLDER,
    payload,
  };
};

export const createFolder = (data) => (dispatch) => {
  console.log(data);
};
