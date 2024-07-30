import * as types from "../actionTypes/authActionTypes";
import fire from "../../config/firebase";

// TypeScript interfaces for better type safety
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: string;
}

interface SignInUserPayload extends User {
  role: string;
}

const fetchUserRole = async (uid: string): Promise<string> => {
  try {
    const adminUserDoc = await fire
      .firestore()
      .collection("admin-users")
      .doc(uid)
      .get();
    if (adminUserDoc.exists) {
      return adminUserDoc.data()?.role || "user";
    }
    return "user";
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw new Error("Error fetching user role");
  }
};

const loginUser = (payload: SignInUserPayload) => ({
  type: types.SIGN_IN,
  payload,
});

const logoutUser = () => ({
  type: types.SIGN_OUT,
});

export const signInUser =
  (
    email: string,
    password: string,
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void,
    setSuccessMessage?: (message: string) => void
  ) =>
  async (dispatch: (action: any) => void) => {
    setLoading(true);
    try {
      const userCredential = await fire
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (!user) throw new Error("No user found");

      const role = await fetchUserRole(user.uid);

      dispatch(
        loginUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role || "user",
        })
      );

      setLoading(false);
      setError("");
      if (setSuccessMessage) {
        setSuccessMessage("You are now logged in.");
      }
    } catch (error) {
      setLoading(false);
      setError("Invalid Email or Password");
      console.error("Error signing in:", error);
    }
  };

export const signUpUser =
  (
    name: string,
    email: string,
    password: string,
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void,
    setSuccessMessage?: (message: string) => void
  ) =>
  async (dispatch: (action: any) => void) => {
    setLoading(true);
    try {
      const userCredential = await fire
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (!user) throw new Error("No user found");

      await user.updateProfile({ displayName: name });

      dispatch(
        loginUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );

      setLoading(false);
      setError("");
      if (setSuccessMessage) {
        setSuccessMessage("Registration successful! You are now logged in.");
      }
    } catch (error) {
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
    }
  };

export const signOutUser = () => async (dispatch: (action: any) => void) => {
  try {
    await fire.auth().signOut();
    dispatch(logoutUser());
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const checkIsLoggedIn = () => (dispatch: (action: any) => void) => {
  fire.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const role = await fetchUserRole(user.uid);

      dispatch(
        loginUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role,
        })
      );
    } else {
      dispatch(logoutUser());
    }
  });
};
