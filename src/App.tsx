import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomePage, Register, Login, DashboardPage } from "./pages";
import { checkIsLoggedIn } from "./redux/actionCreators/authActionCreator";
import { RootState } from "./redux/store";
import AdminDashboard from "./pages/DashboardPage/AdminDashboard";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    role: state.auth.role,
  }));

  useEffect(() => {
    dispatch(checkIsLoggedIn());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <DashboardPage /> : <HomePage />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <HomePage />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
