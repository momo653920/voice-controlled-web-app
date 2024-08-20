import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";
import logo from "./logo.png";

const NavigationComponent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black">
      <div className="navbar-brand-container">
        <img src={logo} alt="logo" className="navbar-logo" />
        <Link className="navbar-brand" to="/">
          Jessica
        </Link>
      </div>

      <ul className="navbar-nav ms-auto me-5">
        {!isAdminPage && (
          <>
            <li className="nav-item">
              <Link className="btn btn-success" to="/register">
                Регистрирай се
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-primary" to="/login">
                Влез
              </Link>
            </li>
          </>
        )}
        <li className="nav-item">
          <Link className="btn btn-info" to="/dashboard">
            Табло
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationComponent;
