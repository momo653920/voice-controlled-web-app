import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserStatus,
  resetUserPassword,
} from "../../redux/actionCreators/userActionCreator";
import { RootState } from "../../redux/store";
import "./AdminDashboard.css";
import Navbar from "../../components/HomePageComponents/Navigation";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserStatusToggle = (userId: string, isActive: boolean) => {
    dispatch(updateUserStatus(userId, !isActive));
  };

  const handleResetPassword = (email: string) => {
    setResetEmail(email);
    setShowResetModal(true);
  };

  const submitResetPassword = () => {
    dispatch(
      resetUserPassword(
        resetEmail,
        setResetLoading,
        setResetError,
        setResetSuccessMessage
      )
    );
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        {loading && <p>Loading users...</p>}
        {error && <p>Error: {error}</p>}
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
            {users &&
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.displayName}</td>
                  <td>{user.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className={`btn ${user.active ? "btn-danger" : "btn-success"}`}
                      onClick={() =>
                        handleUserStatusToggle(user.id, user.active)
                      }
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="btn btn-warning ms-2"
                      onClick={() => handleResetPassword(user.email)}
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {showResetModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Reset Password for {resetEmail}</h3>
              <button onClick={submitResetPassword} disabled={resetLoading}>
                {resetLoading ? "Sending..." : "Send Password Reset Email"}
              </button>
              <button onClick={() => setShowResetModal(false)}>Close</button>
              {resetError && <p className="error-text">{resetError}</p>}
              {resetSuccessMessage && (
                <p className="success-text">{resetSuccessMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
