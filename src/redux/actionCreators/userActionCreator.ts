import fire from "../../config/firebase";
import * as types from "../actionTypes/userActionTypes";

// Fetch all users from Firebase Firestore
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

// Action to activate or deactivate a user
export const updateUserStatus = (userId, status) => async (dispatch) => {
  try {
    await fire
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ active: status });
    dispatch(fetchUsers()); // Refresh the user list
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};
