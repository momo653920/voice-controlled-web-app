import { combineReducers } from "redux";
import authReducer from "./authReducer";
import fileFoldersReducer from "./fileFoldersReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  filefolders: fileFoldersReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
