import * as types from "../actionTypes/authActionTypes";
import { AuthActionTypes } from "../actionTypes/authActionTypes";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  role: string;
  userId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: "user",
  userId: null,
};

const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        userId: action.payload.userId,
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
