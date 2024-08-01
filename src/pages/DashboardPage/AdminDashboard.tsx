import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStatus,
  resetPassword,
  deleteUserAccount,
  fetchUsers,
} from "../../redux/actionCreators/userActionCreator";
import { RootState } from "../../redux/store";
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
    dispatch(updateUserStatus(userId, !active)); // Toggle the status
  };

  const handlePasswordReset = (email: string) => {
    dispatch(resetPassword(email));
  };

  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUserAccount(userId));
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
