// App.js
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HomePage,
  Register,
  Login,
  DashboardPage,
  TrialDashboardPage,
  AdminDashboard,
} from "./pages";
import { checkIsLoggedIn } from "./redux/actionCreators/authActionCreator";
import { RootState } from "./redux/store";
import CreateFile from "./components/DashboardComponents/CreateFile/CreateFile";

const PrivateRoute = ({
  element,
  isAuthenticated,
}: {
  element: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  return isAuthenticated ? <>{element}</> : <HomePage />;
};

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
        <Route path="/trial/*" element={<TrialDashboardPage />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute
              element={<DashboardPage />}
              isAuthenticated={isAuthenticated}
            />
          }
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
        <Route path="/create-file" element={<CreateFile />} />
      </Routes>
    </div>
  );
};

export default App;
