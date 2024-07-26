import { NavigationComponent } from "../../components/HomePageComponents";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <NavigationComponent />
      <div className="container">
        <div className="options-container">
          <div className="option">
            <h2>Want to try for free?</h2>
            <Link to="/trial">
              <button className="btn btn-primary">Try for Free</button>
            </Link>
          </div>
          <div className="option">
            <h2>Want to Join Us?</h2>
            <Link to="/register">
              <button className="btn btn-primary">Register</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-secondary">Login</button>
            </Link>
          </div>
        </div>
        <div className="description">
          <h3>About the Project</h3>
          <p>
            Welcome to the React Voice Controlled File Management System. This
            innovative application allows users to manage their files using
            voice commands, providing a hands-free and efficient way to organize
            and access documents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
