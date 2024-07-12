import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HomePage, Register, Login, DashboardPage } from "./pages";
import { checkIsLoggedIn } from "./redux/actionCreators/authActionCreator";
import "./App.css";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkIsLoggedIn()); // Dispatch action to check if user is logged in
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
    </div>
  );
};

export default App;
