import { Link } from "react-router-dom";
import RegisterForm from "../../../components/AuthComponents/RegisterForm";
import { NavigationComponent } from "../../../components/HomePageComponents";

const Register = () => {
  return (
    <div>
      <NavigationComponent />
      <div className="container-fluid">
        <h1 className="display-1 my-5 text-center">Register</h1>
        <div className="row">
          <div className="col-md-6 mx-auto mt-5">
            <RegisterForm />
            Already a member?
            <Link to="/login" className="text-end">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
