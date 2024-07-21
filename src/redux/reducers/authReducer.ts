import * as types from "../actionTypes/authActionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isAdmin: action.payload.admin || false, // Set admin status
      };
    case types.SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isAdmin: false, // Reset admin status
      };
    default:
      return state;
  }
};

export default authReducer;
