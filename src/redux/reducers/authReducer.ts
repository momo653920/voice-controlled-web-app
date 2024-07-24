import * as types from "../actionTypes/authActionTypes";
import { AuthActionTypes } from "../actionTypes/authActionTypes";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  role: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: "user",
};

const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        role: action.payload.role || "user",
      };
    case types.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
