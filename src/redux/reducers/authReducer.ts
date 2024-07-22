import * as types from "../actionTypes/authActionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  role: "user",
};

const authReducer = (state = initialState, action: any) => {
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
