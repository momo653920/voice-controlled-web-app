import * as types from "../actionTypes/userActionTypes";

interface UserState {
  users: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload };
    case types.FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case types.UPDATE_USER_STATUS_REQUEST:
      return { ...state, loading: true };
    case types.UPDATE_USER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? { ...user, active: action.payload.status }
            : user
        ),
      };
    case types.UPDATE_USER_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case types.RESET_USER_PASSWORD_REQUEST:
      return { ...state, loading: true };
    case types.RESET_USER_PASSWORD_SUCCESS:
      return { ...state, loading: false };
    case types.RESET_USER_PASSWORD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
