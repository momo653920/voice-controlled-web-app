import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomePage, Register, Login, DashboardPage } from "./pages";
import { checkIsLoggedIn } from "./redux/actionCreators/authActionCreator";
import "./App.css";
import { RootState } from "./redux/store";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

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
      </Routes>
    </div>
  );
};

export default App;
