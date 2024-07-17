import * as types from "../actionTypes/authActionTypes";
import fire from "../../config/firebase";

// Action creators for logging in and logging out
const loginUser = (payload) => {
  return {
    type: types.SIGN_IN,
    payload,
  };
};

const logoutUser = () => {
  return {
    type: types.SIGN_OUT,
  };
};

// Async action creator for signing in
export const signInUser =
  (email, password, setLoading, setError, setSuccessMessage) => (dispatch) => {
    setLoading(true);
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(
          loginUser({
            uid: user.user.uid,
            email: user.user.email,
            displayName: user.user.displayName,
          })
        );
        setLoading(false);
        setError("");
        if (setSuccessMessage) {
          setSuccessMessage("You are now logged in.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setError("Invalid Email or Password");
        console.error("Error signing in:", error);
      });
  };

// Async action creator for signing up
export const signUpUser =
  (name, email, password, setLoading, setError, setSuccessMessage) =>
  (dispatch) => {
    setLoading(true);
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        fire
          .auth()
          .currentUser.updateProfile({
            displayName: name,
          })
          .then(() => {
            const currentUser = fire.auth().currentUser;
            dispatch(
              loginUser({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
              })
            );
            setLoading(false);
            setError("");
            if (setSuccessMessage) {
              setSuccessMessage(
                "Registration successful! You are now logged in."
              );
            }
          })
          .catch((error) => {
            setLoading(false);
            setError("Error updating profile");
            console.error("Error updating profile:", error);
          });
      })
      .catch((error) => {
        setLoading(false);
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("Email already in use");
            break;
          case "auth/invalid-email":
            setError("Invalid Email");
            break;
          case "auth/weak-password":
            setError("Weak Password");
            break;
          default:
            setError("Error signing up");
            console.error("Error signing up:", error);
        }
      });
  };

// Async action creator for signing out
export const signOutUser = () => (dispatch) => {
  fire
    .auth()
    .signOut()
    .then(() => {
      dispatch(logoutUser());
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};

// Check if the user is logged in
export const checkIsLoggedIn = () => (dispatch) => {
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(
        loginUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
    }
  });
};
