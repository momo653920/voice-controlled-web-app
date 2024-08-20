import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInUser } from "../../redux/actionCreators/authActionCreator";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Ensure this CSS file is imported

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Моля, попълнете всички полета");
      return;
    }
    dispatch(
      signInUser(email, password, setLoading, setError, setSuccessMessage)
    );
  };

  useEffect(() => {
    if (successMessage) {
      navigate("/dashboard");
    }
  }, [successMessage, navigate]);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && (
        <div className="alert alert-danger" aria-live="assertive">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" aria-live="assertive">
          {successMessage}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="email">Имейл:</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="emailHelp"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Парола:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Влизане..." : "Продължи"}
      </button>
    </form>
  );
};

export default LoginForm;
