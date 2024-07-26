import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../../redux/actionCreators/authActionCreator";
import "./Navigation.css";

const NavigationComponent = () => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Jessica
      </Link>

      <ul className="navbar-nav ms-auto me-5">
        {isAuthenticated ? (
          <>
            <li className="nav-item mx-2">
              <p className="my-0 mt-1 mx-2">
                <span className="text-light"> Welcome, </span>
                <span className="text-warning"> {user.displayName} </span>
              </p>
            </li>

            <li className="nav-item mx-2">
              <Link className="btn btn-primary" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-success"
                onClick={() => dispatch(signOutUser())}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item mx-2">
              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-success" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigationComponent;
