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
    default:
      return state;
  }
};

export default userReducer;
