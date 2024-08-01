import fire from "../../config/firebase";
import * as types from "../actionTypes/userActionTypes";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
  try {
    await fire
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ active: status });
    dispatch(fetchUsers());
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};

export const resetPassword = (email) => async () => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export const deleteUserAccount = (userId) => async (dispatch) => {
  try {
    await fire.firestore().collection("users").doc(userId).delete();
    dispatch(fetchUsers());
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
