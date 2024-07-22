import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const addAdminRole = functions.https.onCall(async (data, context) => {
  try {
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Success! ${data.email} has been made an admin.` };
  } catch (error) {
    return error;
  }
});

exports.disableUser = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can disable users."
    );
  }

  try {
    await admin.auth().updateUser(data.uid, { disabled: true });
    return { success: true };
  } catch (error) {
    console.error("Error disabling user:", error);
    throw new functions.https.HttpsError("internal", "Error disabling user");
  }
});

// Enable user account
exports.enableUser = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can enable users."
    );
  }

  try {
    await admin.auth().updateUser(data.uid, { disabled: false });
    return { success: true };
  } catch (error) {
    console.error("Error enabling user:", error);
    throw new functions.https.HttpsError("internal", "Error enabling user");
  }
});

// Reset user password
exports.resetPassword = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can reset passwords."
    );
  }

  try {
    const resetLink = await admin.auth().generatePasswordResetLink(data.email);
    return { resetLink };
  } catch (error) {
    console.error("Error generating password reset link:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error generating password reset link"
    );
  }
});

// Delete user account
exports.deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can delete users."
    );
  }

  try {
    await admin.auth().deleteUser(data.uid);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError("internal", "Error deleting user");
  }
});
