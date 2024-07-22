import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserStatus,
} from "../../redux/actionCreators/userActionCreator";
import { RootState } from "../../redux/store";
import { getFunctions, httpsCallable } from "firebase/functions";
import { NavigationComponent } from "../../components/HomePageComponents";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleStatusChange = (userId: string, active: boolean) => {
    const functions = getFunctions();
    const callableFunction = active
      ? httpsCallable(functions, "enableUser")
      : httpsCallable(functions, "disableUser");

    callableFunction({ uid: userId })
      .then(() => {
        dispatch(fetchUsers()); // Re-fetch users after status update
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
      });
  };

  const handlePasswordReset = (email: string) => {
    const functions = getFunctions();
    const resetPassword = httpsCallable(functions, "resetPassword");

    resetPassword({ email })
      .then((result) => {
        // Provide the reset link or handle accordingly
        console.log("Password reset link:", result.data.resetLink);
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
      });
  };

  const handleDeleteUser = (userId: string) => {
    const functions = getFunctions();
    const deleteUser = httpsCallable(functions, "deleteUser");

    deleteUser({ uid: userId })
      .then(() => {
        dispatch(fetchUsers()); // Re-fetch users after deletion
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <NavigationComponent />
      <h1>Admin Dashboard</h1>
      <table className="table">
        <thead>
          <tr>
            <th>UID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.displayName}</td>
              <td>{user.active ? "Active" : "Inactive"}</td>
              <td>
                <button
                  className={`btn ${user.active ? "btn-danger" : "btn-success"}`}
                  onClick={() => handleStatusChange(user.id, user.active)}
                >
                  {user.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="btn btn-warning ms-2"
                  onClick={() => handlePasswordReset(user.email!)}
                >
                  Reset Password
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
