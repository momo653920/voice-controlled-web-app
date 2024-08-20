import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../../../redux/actionCreators/authActionCreator";
import logo from "../../HomePageComponents/logo.png"; // Update the logo path if needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css"; // Ensure this path is correct

const Navbar = () => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const adminButtonLink = location.pathname === "/admin" ? "/" : "/admin";

  const handleSignOut = () => {
    dispatch(signOutUser());
  };

  return (
    <nav className="custom-navbar navbar navbar-expand-lg shadow-sm">
      <div className="custom-navbar-brand-container">
        <Link className="custom-navbar-brand" to="/dashboard">
          <img src={logo} alt="logo" className="custom-navbar-logo" />{" "}
        </Link>
      </div>

      <ul className="custom-navbar-nav ms-auto">
        <>
          <li className="nav-item mx-2"></li>
          {role === "admin" && (
            <li className="nav-item mx-2">
              <Link className="btn btnUsers" to={adminButtonLink}>
                {location.pathname === "/admin" ? "Начало" : "Потребители"}
              </Link>
            </li>
          )}
          <li className="nav-item ms-auto dropdown">
            <button
              className="profile-icon"
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faUserCircle} />
            </button>
            <ul className="dropdown-menu" aria-labelledby="profileDropdown">
              <li className="dropdown-item-profile">
                <FontAwesomeIcon className="profile-icon" icon={faUserCircle} />
                <div className="dropdown-item-text">
                  <span className="name">{user.displayName}</span>
                  <span className="email">{user.email}</span>
                </div>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleSignOut}>
                  Изход
                </button>
              </li>
            </ul>
          </li>
        </>
      </ul>
    </nav>
  );
};

export default Navbar;
