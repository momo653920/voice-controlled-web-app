import fire from "../../config/firebase";
import * as types from "../actionTypes/userActionTypes";

export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: types.FETCH_USERS_REQUEST });

  try {
    const usersCollection = await fire.firestore().collection("users").get();
    const users = usersCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch({ type: types.FETCH_USERS_SUCCESS, payload: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    dispatch({ type: types.FETCH_USERS_FAILURE, payload: error.message });
  }
};

export const updateUserStatus = (userId, status) => async (dispatch) => {
  dispatch({ type: types.UPDATE_USER_STATUS_REQUEST });

  try {
    await fire
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ active: status });
    dispatch({
      type: types.UPDATE_USER_STATUS_SUCCESS,
      payload: { userId, status },
    });
    dispatch(fetchUsers());
  } catch (error) {
    console.error("Error updating user status:", error);
    dispatch({
      type: types.UPDATE_USER_STATUS_FAILURE,
      payload: error.message,
    });
  }
};

export const resetUserPassword =
  (email, setLoading, setError, setSuccessMessage) => async (dispatch) => {
    dispatch({ type: types.RESET_USER_PASSWORD_REQUEST });

    setLoading(true);
    try {
      await fire.auth().sendPasswordResetEmail(email);
      dispatch({ type: types.RESET_USER_PASSWORD_SUCCESS });
      setLoading(false);
      setSuccessMessage("Password reset email sent successfully.");
      setError("");
    } catch (error) {
      console.error("Error resetting user password:", error);
      dispatch({
        type: types.RESET_USER_PASSWORD_FAILURE,
        payload: error.message,
      });
      setLoading(false);
      setError("Error resetting user password");
    }
  };
