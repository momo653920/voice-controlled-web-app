import { Link } from "react-router-dom";
import LoginForm from "../../../components/AuthComponents/LoginForm";
import { NavigationComponent } from "../../../components/HomePageComponents";

const Login = () => {
  return (
    <div>
      <NavigationComponent />
      <div className="container-fluid">
        <h1 className="display-1 my-5 text-center">Login</h1>
        <div className="row">
          <div className="col-md-6 mx-auto mt-5">
            <LoginForm />
            <Link to="/register" className="d-block text-end">
              Not a member? Register!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
