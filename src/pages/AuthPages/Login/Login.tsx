import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../../components/AuthComponents/LoginForm";
import { NavigationComponent } from "../../../components/HomePageComponents";

const Login = () => {
  return (
    <div>
      <NavigationComponent />
      <div className="container-fluid">
        <h1 className="display-1 my-5 text-center">Вход</h1>
        <div className="row">
          <div className="col-md-4 mx-auto mt-5">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
